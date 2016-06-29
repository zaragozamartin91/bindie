var mongoose = require('mongoose');
var User = mongoose.model('User');
var Ad = mongoose.model('Ad');
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


exports.createForm = function(req, res, next) {
    var userId = req.session.uid;

    if (!userId) {
        res.error("Necesita iniciar sesion para crear un aviso!");
        return res.redirect("back");
    }

    User.findBands(userId, function(err, bands) {
        console.log("bandas: " + bands);
        /*if (!bands || !bands.length) {
            res.error("No perteneces a ninguna banda!");
            return res.redirect('back');
        }*/

        req.bands = res.locals.bands = bands;

        User.findPlaces(userId, function(err, places) {
            console.log("lugares: " + bands);
            /*if (!places || !places.length) {
                res.error("No perteneces a ninguna banda!");
                return res.redirect('back');
            }*/

            req.places = res.locals.places = places;

            res.render('createAd', {
                title: 'Crear Aviso',
                bands: bands,
                places: places
            });

        });
 
    });

};


exports.createSubmit = function(req, res, next) {
    console.log("Aviso a crear: ");
    var data = req.body;
    console.log(data);

/*
    Ad.findOneByName(data.name, function(err, ad) {
        if (err) {
            return next(err);
        }

        if (ad) {
            res.error("Aviso " + data.name + " ya existe!");
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

    });*/
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