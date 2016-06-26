var mongoose = require('mongoose');
var User = mongoose.model('User');
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