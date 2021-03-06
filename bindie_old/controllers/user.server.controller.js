var mongoose = require('mongoose');
var User = mongoose.model('User');
var Band = mongoose.model('Band');
var Location = mongoose.model('Location');
var Event = mongoose.model('Event');
var Song = mongoose.model('Song');
var ObjectId = mongoose.Types.ObjectId;
// var path = require('path');

function getSessionUserId(req) {
    return req.session.uid;
}

function setSessionUserId(req, uid) {
    req.session.uid = uid;
}

/*funcion API que busca un usuario por ID*/
exports.getById = function(req, res) {
    var userId = req.params.userId;
    console.log("getById::buscando usuario:" + userId);

    User.findOne({
        _id: new ObjectId(userId)
    }, function(err, user) {
        if (err) {
            console.error("getById::algo salio mal buscando el usuario:" + userId);
            return res.json({
                error: err
            });
        }

        return res.json(user);
    });
};

/*funcion API que retorna todas las bandas de un usuario en formato Json*/
exports.getBands = function(req, res) {
    User.findBands(req.params.userId, function(err, bands) {
        if (err) {
            return res.json({
                error: err
            });
        }

        console.log("Bandas encontradas:" + bands);
        return res.json(bands);
    });
};

/*funcion API que retorna todas los lugares de un usuario en formato Json*/
exports.getLocations = function(req, res) {
    User.findLocations(req.params.userId, function(err, locations) {
        if (err) {
            return res.json({
                error: err
            });
        }

        console.log("Lugares encontrados:" + locations);
        return res.json(locations);
    });
};

/*lista usuarios como objetos json para ser consumidos usando Ajax*/
exports.list = function(req, res) {
    // console.log(path.join(__dirname,'public'));

    User.find({}, function(err, users) {
        if (err) {
            console.error("Algo salio mal!");
            return res.json({
                error: err
            });
        }

        res.json(users);
    });
};


/*Redirecciona a la vista de registro "register.ejs".*/
exports.registerForm = function(req, res) {
    if (getSessionUserId(req)) {
        res.message("No puede registrarse con una sesion activa!");
        return res.redirect('back');
    }

    res.render('register', {
        title: 'Register'
    });
};



/*returns a unified error message from a Mongoose error object.*/
var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    return message;
};

/*logica para procesar formulario de register.ejs y registrar un usuario*/
exports.registerSubmit = function(req, res, next) {
    console.log("Formulario de usuario subido: ");
    var data = req.body;

    User.findOneByEmail(data.email, function(err, user) {
        if (err) return next(err);

        if (user) {
            res.error("Ya existe un usuario con ese correo!");
            return res.redirect("back");
        }

        console.log("Guardando usuario:");
        console.log(data);
        user = new User(data);

        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                console.log("Algo salio mal: ");
                console.log(err);
                res.error(message);
                return res.redirect('back');
            }

            console.log("Usuario guardado:");
            console.log(user);
            setSessionUserId(req, user._id);
            console.log("req.session.uid:");
            console.log(req.session.uid);
            res.redirect('/');
        });
    });
};


/*Api para registrar usuarios sin interfaz usando Ajax.*/
exports.registerApi = function(req, res) {
    console.log("Usuario subido: ");
    var data = req.body;

    User.findOneByEmail(data.email, function(err, user) {
        if (err) {
            return res.json({
                error: err
            });
        }

        if (user) {
            return res.json({
                error: "usuario ya existe!"
            });
        }

        console.log("Guardando usuario:");
        console.log(req.body);
        user = new User(req.body);

        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                return res.json({
                    error: err,
                    errorMessage: message
                });
            }

            console.log("Usuario guardado:");
            console.log(user);
            res.json(user);
        });
    });
};


/*Renderiza el formulario de login.*/
exports.loginForm = function(req, res) {
    if (getSessionUserId(req)) {
        res.message("Ya ha iniciado sesion!");
        res.redirect("back");
    }

    res.render('login', {
        title: 'login'
    });
};

/*Procesa el formulario de login.*/
exports.loginSubmit = function(req, res, next) {
    var data = req.body;
    console.log("loginSubmit::Procesando login de:");
    console.log(data);

    User.findOneByEmail(data.email, function(err, user) {
        if (!user) {
            res.error('No existe un usuario con email: ' + data.email);
            return res.redirect('back');
        }

        console.log("loginSubmit::usuario: " + user + " encontrado!");

        var userOk = user.authenticate(data.password);

        if (userOk) {
            req.session.uid = user._id;
            return res.redirect('/');
        }

        res.error('Credenciales invalidas!');
        res.redirect('back');
    });
};

/*Destruye la sesion de usuario*/
exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        if (err) throw err;
        res.redirect('/');
    });
};

exports.getByEmail = function(req, res) {
    var userEmail = req.params.userEmail;
    console.log("userEmail: " + userEmail);

    if (!userEmail || userEmail === "") {
        return res.json({
            error: "No se indico el correo del usuario!"
        });
    }

    User.find({
        email: new RegExp(userEmail, 'i')
    }, function(err, user) {
        if (err) {
            return res.json({
                error: err
            });
        }

        res.json(user);
    });
};

/*la idea es que en browse My bands haya opciones para trabajar con la banda o algo asi.*/
exports.browseMyBands = function(req, res, next) {
    var userId = req.session.uid;

    if (!userId) {
        res.error("No has iniciado sesion para ver tus bandas!");
        return res.redirect("back");
    }

    User.findBands(userId, function(err, bands) {
        if (err) {
            var errorMessage = getErrorMessage(err);
            res.error(errorMessage);
            return res.redirect("back");
        }

        req.bands = res.locals.bands = bands;
        res.render('myBands', {
            title: "Mis Bandas",
            bands: bands
        });
    });
};

/*la idea es que en browse My locations haya opciones para trabajar con el lugar o algo asi.*/
exports.browseMyLocations = function(req, res, next) {
    var userId = req.session.uid;

    if (!userId) {
        res.error("No has iniciado sesion para ver tus lugares!");
        return res.redirect("back");
    }

    User.findLocations(userId, function(err, locations) {
        if (err) {
            var errorMessage = getErrorMessage(err);
            res.error(errorMessage);
            return res.redirect("back");
        }

        req.locations = res.locals.locations = locations;
        res.render('myLocations', {
            title: "Mis Lugares",
            locations: locations
        });
    });
};

/*No realiza paginacion. En browseEvent.ejs se expondran todos los eventos...*/
exports.browseMyEvents = function(req, res, next) {
    var userId = req.session.uid;

    if (!userId) {
        res.error("No has iniciado sesion para ver tus lugares!");
        return res.redirect("back");
    }

    User.findEvents(userId, function(err, events) {
        console.log("EVENTOS ENCONTRADOS:");
        console.log(events);

        if (err) {
            var errorMessage = getErrorMessage(err);
            res.error(errorMessage);
            return res.redirect("back");
        }

        console.log("RENDERIZANDO events.ejs");

        req.events = res.locals.events = events;
        res.render('events', {
            title: "Eventos creados",
            events: events
        });
    });
};

/*Busca los eventos a los que uno fue invitado por like a canciones*/
exports.browseInvitedEvents = function(req, res, next) {
    	var userId = req.session.uid;

	Event.findAllEvents(function(err, events) {
		Song.searchByLike(userId, function(errSong, songs) {
			console.log("CANCIONES ENCONTRADAS:");
			console.log(songs);

			if (errSong) {
			    var errorMessage = getErrorMessage(err);
			    res.error(errorMessage);
			    return res.redirect("back");
			}
			req.songs = res.locals.songs = songs;

			if (err) throw err;
			console.log("EVENTOS ENCONTRADOS:");
			console.log(events);
			req.events = res.locals.events = events;

			console.log("RENDERIZANDO events.ejs");
			res.render('invitedEvents', {
			    title: "Eventos a los que has sido invitado",
			    events: events,
			    songs: songs
			});
		});
	});
};

/*Busca todos los eventos*/
exports.browseAllEvents = function(req, res, next) {
    var userId = req.session.uid;

    if (!userId) {
        res.error("No has iniciado sesion para ver tus lugares!");
        return res.redirect("back");
    }

    Event.findAllEvents(function(err, events) {
        console.log("EVENTOS ENCONTRADOS:");
        console.log(events);

        if (err) {
            var errorMessage = getErrorMessage(err);
            res.error(errorMessage);
            return res.redirect("back");
        }

        console.log("RENDERIZANDO events.ejs");

        req.events = res.locals.events = events;
        res.render('events', {
            title: "Todos los eventos",
            events: events
        });
    });
};

/* Lista las notificaciones de hitos de canciones de bandas */
exports.getNotificationMusic = function(req, res){
	var userId = req.session.uid;

    if (!userId) {
        res.error("Debe iniciar sesion para ver las notificaciones!");
        return res.redirect("back");
    }
	
	var notificationSongs = [];
	var bandsArray = [];
	
	console.log("Entrando a bandas");
    Song.searchByMember(userId, function(err, songs) {
        if (err) {
            var errorMessage = getErrorMessage(err);
            res.error("Aún no perteneces a ninguna banda!");
			songs = [];
        }
		
		res.notifications = notificationSongs;
        res.render('musicNotifications', {
            title: "Notificaciones de Música",
            bandSongs: songs
        });
		
    });
}
