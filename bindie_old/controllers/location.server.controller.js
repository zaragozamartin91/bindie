var mongoose = require('mongoose');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
var Band = mongoose.model('Band');
var Contract = mongoose.model('Contract');
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

exports.contract = function(req, res) {
    var userId = req.session.uid;
    if (!userId) {
        res.error("Debe iniciar sesion para contratar a un lugar!");
        return res.redirect("back");
    }

    var locationId = req.params.locationId;

    if (locationId) {
        Location.findOne({
            _id: locationId
        }, function(err, location) {
            if (err) {
                var errorMessage = getErrorMessage(err);
                res.error(errorMessage);
                return res.redirect("back");
            }

            User.findBands(userId, function(err, bands) {
                if (err) {
                    var errorMessage = getErrorMessage(err);
                    res.error(errorMessage);
                    return res.redirect("back");
                }

                req.bands = res.locals.bands = bands;
                req.location = res.locals.location = location;

                return res.render('createContractLocation', {
                    title: "Contratar lugar",
                    bands: bands,
                    location: location
                });
            });

        });
    } else {
        res.error("No se indico el id del lugar a contratar!");
        return res.redirect("back");
    }
};

/*funcion para procesar la creacion de un contrato para un lugar...*/
exports.createContract = function(req, res, next) {
    var data = req.body;

    data.eventDate = new Date(data.eventDate);
    data.expirationDate = new Date(data.expirationDate);

    var hours = data.eventTime.split(":")[0];
    var minutes = data.eventTime.split(":")[1];
    data.eventDate.setHours(hours);
    data.eventDate.setMinutes(minutes);

    data.type = 'toLocation';

    console.log("DATOS DE CONTRATO RECIBIDOS: ");
    console.log(data);

    Location.findOneByName(data.location, function(err, location) {
        if (err) {
            return next(err);
        }

        if (!location) {
            res.error("EL LUGAR " + data.location + " NO EXISTE!");
            return res.redirect("back");
        }

        data.location = new ObjectId(location._id);


        Band.findOneByName(data.band, function(err, band) {
            if (err) {
                return next(err);
            }

            if (!band) {
                res.error("LA BANDA " + data.band + " NO EXISTE!");
                return res.redirect("back");
            }

            data.band = new ObjectId(band._id);

            contract = new Contract(data);

            console.log("CONTRATO A GUARDAR:");
            console.log(contract);
            contract.save(function(err) {
                if (err) {
                    var message = getErrorMessage(err);
                    console.log("Algo salio mal: " + err);
                    res.error(message);
                    return res.redirect('back');
                }

                console.log("Contrato creado:");
                console.log(contract);
                res.success("Contrato creado exitosamente!");
                res.redirect("back");
            });
        });
    });
};