var mongoose = require('mongoose');
var User = mongoose.model('User');

function getSessionUserId(req) {
    return req.session.uid;
}

function setSessionUserId(req, uid) {
    req.session.uid = uid;
}

exports.list = function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) {
            console.error("Something went wrong!");
            return next(err);
        }

        res.json(users);
    });
};


/*Redirecciona a la vista de registro "register.ejs".*/
exports.registerForm = function(req, res) {
    if (getSessionUserId(req)) {
        res.message("Ya ha iniciado sesion!");
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
        console.log(req.body);
        user = new User(req.body);

        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
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
    console.log("Procesando login de:");
    console.log(data);

    User.findOneByEmail(data.email, function(err, user) {
        if (!user) {
            res.error('No existe un usuario con email: ' + data.email);
            return res.redirect('back');
        }

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