var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var Location = mongoose.model('Location');
var Band = mongoose.model('Band');
var ObjectId = mongoose.Types.ObjectId;


/*returns a unified error message from a Mongoose error object.*/
var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        message = 'Something went wrong';
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    return message;
};


/*funcion API para listar todos los eventos*/
exports.list = function(req, res) {
    Event.find({}, function(err, events) {
        if (err) {
            return res.json(err);
        }

        res.json(events);
    });
};


exports.createForm = function(req, res, next) {
    if (!req.session.uid) {
        res.error("Necesita iniciar sesion para crear un evento!");
        return res.redirect("back");
    }

    User.find({}, function(err, users) {
        req.users = res.locals.users = users;
	User.findLocations(req.session.uid, function(err, locations) {
            req.locations = res.locals.locations = locations;

            Band.find({}, function(err, bands) {
                req.bands = res.locals.bands = bands;

                res.render('createEvent', {
                    title: 'Crear evento',
                    users: users,
                    locations: locations,
                    bands: bands
                });
            });
        });
    });
};



/*funcion para procesar la creacion de un evento...*/
exports.createSubmit = function(req, res, next) {
    console.log("Evento a subir: ");
    var data = req.body;
    console.log(data);

    data.date = new Date(data.date);

    var hours = data.time.split(":")[0];
    var minutes = data.time.split(":")[1];
    data.date.setHours(hours);
    data.date.setMinutes(minutes);


    Event.findOneByName(data.name, function(err, event) {
        if (err) {
            return next(err);
        }

        if (event) {
            res.error("Evento " + data.name + " ya existe!");
            return res.redirect("back");
        }

        var memberEmails = data.members;
        var queryArray = [];

        if (memberEmails.forEach) {
            memberEmails.forEach(function(memberEmail) {
                queryArray.push({
                    email: memberEmail
                });
            });
        } else {
            queryArray = [{
                email: memberEmails
            }];
        }

        User.find({
            $or: queryArray
        }, function(err, users) {
            data.members = [];


            if (users.forEach) {
                users.forEach(function(user) {
                    data.members.push(new ObjectId(user._id));
                });
            } else {
                data.members.push(new ObjectId(users));
            }

            console.log("SOCIOS DEL LUGAR DEL EVENTO: " + data.members);

            Location.findOneByName(data.location, function(err, location) {
                data.location = new ObjectId(location._id);

                Band.findOneByName(data.band, function(err, band) {
                    if (band) {
                        data.band = new ObjectId(band._id);
                    } else {
                        data.band = null;
                    }

                    event = new Event(data);

                    console.log("EVENTO A GUARDAR:" + event);
                    event.save(function(err) {
                        if (err) {
                            var message = getErrorMessage(err);
                            console.log("Algo salio mal: " + err);
                            res.error(message);
                            return res.redirect('back');
                        }

                        console.log("Evento creado:");
                        console.log(event);
                        res.success("Evento " + event.name + " creado exitosamente!");
                        res.redirect("back");
                    });
                });
            });
        });
    });
};


exports.getByName = function(req, res) {
    var eventName = req.params.eventName;

    if (!eventName || eventName === "") {
        eventName = ".*";
    }

    Event.find({
        /*Busco un lugar ignorando mayusculas y minusculas*/
        name: new RegExp(eventName, "i")
    }, function(err, events) {
        if (err) {
            return res.json({
                error: err
            });
        }

        return res.json(events);
    });
};

/*No realiza paginacion. En browseEvent.ejs se expondran todos los eventos...*/
exports.browseEvents = function(req, res, next) {
    if (req.session.uid) {
        res.render('browseEvents', {
            title: "Buscar eventos",
        });
    } else {
        res.error("Debe iniciar sesion para buscar eventos!");
        res.redirect("back");
    }
};

exports.getById = function(req, res) {
    var eventId = req.params.eventId;

    if (!eventId) {
        return res.json([]);
    }

    Event.findOne({
        _id: eventId
    }, function(err, event) {
        res.json(event);
    });
};
