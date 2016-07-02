var mongoose = require('mongoose');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
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


/*funcion API para listar todos los lugares*/
exports.list = function(req, res) {
    Location.find({}).populate('members').exec(function(err, locations) {
        if (err) {
            return res.json(err);
        }

        res.json(locations);
    });

    /*Band.find({}, function(err, bands) {
        if (err) {
            return res.json(err);
        }

        res.json(bands);
    });*/
};


exports.createForm = function(req, res, next) {
    if (!req.session.uid) {
        res.error("Necesita iniciar sesion para crear un lugar!");
        return res.redirect("back");
    }

    User.find({}, function(err, users) {
        req.users = res.locals.users = users;

        res.render('createLocation', {
            title: 'Crear lugar',
            users: users
        });
    });
};



/*funcion para procesar la creacion de un lugar...*/
exports.createSubmit = function(req, res, next) {
    console.log("Lugar a subir: ");
    var data = req.body;
    console.log(data);

    Location.findOneByName(data.name, function(err, location) {
        if (err) {
            return next(err);
        }

        if (location) {
            res.error("Lugar " + data.name + " ya existe!");
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

            console.log("Socios del lugar: " + data.members);
            location = new Location(data);

            console.log("Lugar a guardar:" + location);
            location.save(function(err) {
                if (err) {
                    var message = getErrorMessage(err);
                    console.log("Algo salio mal: " + err);
                    res.error(message);
                    return res.redirect('back');
                }

                console.log("Lugar creado:");
                console.log(location);
                res.success("Lugar " + location.name + " creado exitosamente!");
                res.redirect("back");
            });
        });

    });
};


exports.getByName = function(req, res) {
    var locationName = req.params.locationName;

    if (!locationName || locationName === "") {
        locationName = ".*";
    }

    Location.find({
        /*Busco un lugar ignorando mayusculas y minusculas*/
        name: new RegExp(locationName, "i")
    }, function(err, locations) {
        if (err) {
            return res.json({
                error: err
            });
        }

        return res.json(locations);
    });
};

/*No realiza paginacion. En browseLocation.ejs se expondran todos los lugares...*/
exports.browseLocations = function(req, res, next) {
    if (req.session.uid) {
        res.render('browseLocations', {
            title: "Buscar lugares",
        });
    } else {
        res.error("Debe iniciar sesion para buscar lugares!");
        res.redirect("back");
    }
};

exports.getById = function(req, res) {
    var locationId = req.params.locationId;

    if (!locationId) {
        return res.json([]);
    }

    Location.findOne({
        _id: locationId
    }, function(err, location) {
        res.json(location);
    });
};