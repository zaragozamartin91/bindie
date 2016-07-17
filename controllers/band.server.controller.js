var mongoose = require('mongoose');
var User = mongoose.model('User');
var Band = mongoose.model('Band');
var ObjectId = mongoose.Types.ObjectId;
var Contract = mongoose.model('Contract');
var Location = mongoose.model('Location');

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


/*funcion API para listar todas las bandas*/
exports.list = function(req, res) {
    Band.find({}).populate('members').exec(function(err, bands) {
        if (err) {
            return res.json(err);
        }

        res.json(bands);
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
        res.error("Necesita iniciar sesion para crear una banda!");
        return res.redirect("back");
    }

    User.find({}, function(err, users) {
        req.users = res.locals.users = users;

        res.render('createBand', {
            title: 'Crear banda',
            users: users
        });
    });
};



/*funcion para procesar la creacion de una banda...*/
exports.createSubmit = function(req, res, next) {
    console.log("Banda a subir: ");
    var data = req.body;
    console.log(data);

    Band.findOneByName(data.name, function(err, band) {
        if (err) {
            return next(err);
        }

        if (band) {
            res.error("Banda " + data.name + " ya existe!");
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

            users.forEach(function(user) {
                data.members.push(new ObjectId(user._id));
            });

            console.log("Miembros de la banda: " + data.members);
            band = new Band(data);

            console.log("Banda a guardar:" + band);
            band.save(function(err) {
                if (err) {
                    var message = getErrorMessage(err);
                    console.log("Algo salio mal: " + err);
                    res.error(message);
                    return res.redirect('back');
                }

                console.log("Banda creada:");
                console.log(band);
                res.success("Banda " + band.name + " creada exitosamente!");
                res.redirect("back");
            });
        });

    });
};


exports.getByName = function(req, res) {
    var bandName = req.params.bandName;

    if (!bandName || bandName === "") {
        bandName = ".*";
    }

    Band.find({
        /*Busco una banda ignorando mayusculas y minusculas*/
        name: new RegExp(bandName, "i")
    }, function(err, bands) {
        if (err) {
            return res.json({
                error: err
            });
        }

        return res.json(bands);
    });
};

/*No realiza paginacion. En browseBands.ejs se expondran todas las bandas...*/
exports.browseBands = function(req, res, next) {
    if (req.session.uid) {
        res.render('browseBands', {
            title: "Buscar bandas",
        });
    } else {
        res.error("Debe iniciar sesion para buscar bandas!");
        res.redirect("back");
    }
};

exports.getById = function(req, res) {
    var bandId = req.params.bandId;

    if (!bandId) {
        return res.json([]);
    }

    Band.findOne({
        _id: bandId
    }, function(err, band) {
        res.json(band);
    });
};

exports.contract = function(req, res) {
    var userId = req.session.uid;
    if (!userId) {
        res.error("Debe iniciar sesion para contratar a una banda!");
        return res.redirect("back");
    }

    var bandId = req.params.bandId;

    if (bandId) {
        Band.findOne({
            _id: bandId
        }, function(err, band) {
            if (err) {
                var errorMessage = getErrorMessage(err);
                res.error(errorMessage);
                return res.redirect("back");
            }

            User.findLocations(userId, function(err, locations) {
                if (err) {
                    var errorMessage = getErrorMessage(err);
                    res.error(errorMessage);
                    return res.redirect("back");
                }

                req.locations = res.locals.locations = locations;
                req.band = res.locals.band = band;

                return res.render('createContract', {
                    title: "Contratar banda",
                    band: band,
                    locations: locations
                });
            });

        });
    } else {
        res.error("No se indico el id de la banda a contratar!");
        return res.redirect("back");
    }
};

/*funcion para procesar la creacion de un contrato para una banda...*/
exports.createContract = function(req, res, next) {
    var data = req.body;

    data.eventDate = new Date(data.eventDate);
    data.expirationDate = new Date(data.expirationDate);

    var hours = data.eventTime.split(":")[0];
    var minutes = data.eventTime.split(":")[1];
    data.eventDate.setHours(hours);
    data.eventDate.setMinutes(minutes);

    data.type = 'toBand';

    console.log("DATOS DE CONTRATO RECIBIDOS: ");
    console.log(data);

    Band.findOneByName(data.band, function(err, band) {
        if (err) {
            return next(err);
        }

        if (!band) {
            res.error("LA BANDA " + data.band + " NO EXISTE!");
            return res.redirect("back");
        }

        //console.log("El id de la banda es " + new ObjectId(band._id));
        data.band = new ObjectId(band._id);


        Location.findOneByName(data.location, function(err, location) {
            if (err) {
                return next(err);
            }

            if (!location) {
                res.error("EL LUGAR " + data.location + " NO EXISTE!");
                return res.redirect("back");
            }

            data.location = new ObjectId(location._id);

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


exports.searchByGenreApi = function(req, res) {
    var genre = req.params.genre;

    Band.searchByGenre(genre, function(err, bands) {
        console.log("BANDAS DE GENERO " + genre + " ENCONTRADAS: " + bands);
        res.json(bands);
    });
};

exports.searchMemberApi = function(req,res) {
    var member = req.params.member;

    Band.searchByMembers(member, function(req, bands){
        console.log("BANDAS CON MIEMBRO " + member + " ENCONTRADAS: ");
        console.log(bands);
        res.json(bands);
    });
};


exports.listContractsApi = function(req, res) {
    
};