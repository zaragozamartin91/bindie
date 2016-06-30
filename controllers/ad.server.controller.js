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

    var data = req.body;
    console.log(data);

    var userId = req.session.uid;

    if (!userId) {
        res.error("No has iniciado sesion para ver tus avisos!");
        return res.redirect("back");
    }

    // No valido si las referencias existen por ser un prototipo
    // data.type;
    if (data.type === "band") {
        if (!data.referenceBand) {
            res.error("Es necesario seleccionar una banda");
            return res.redirect('back');
        }        
        data.band = ObjectId(data.referenceBand);
    } else { // place
        if (!data.referencePlace) {
            res.error("Es necesario seleccionar un lugar");
            return res.redirect('back');
        }
        data.place = ObjectId(data.referencePlace);        
    }
    data.user = userId;
    // data.duration;
    // data.visibility;

    ad = new Ad(data);

    ad.save(function(err) {
        if (err) {
            var message = getErrorMessage(err);
            console.log("Algo salio mal: " + err);
            res.error(message);
            return res.redirect('back');
        }

        console.log("Aviso creado:");
        console.log(ad);
        res.success("Aviso creada exitosamente!");
        res.redirect("back");
    });

};

exports.browseAds = function(req, res, next) {

    var userId = req.session.uid;

    if (!userId) {
        res.error("No has iniciado sesion para ver tus avisos!");
        return res.redirect("back");
    }

    Ad.findByUser(userId, function(err, ads) {
        console.log(ads);
        if (err) {
            var errorMessage = getErrorMessage(err);
            res.error(errorMessage);
            return res.redirect("back");
        }

        req.ads = res.locals.ads = ads;
        res.render('browseAds', {
            title: "Mis Avisos",
            ads: ads
        });
    });    
};

exports.showAds = function(req, res, next) {

    Ad.findActiveByVisibility("gold", function(err, ads) {
        if (err) {
            var errorMessage = getErrorMessage(err);
            res.error(errorMessage);
            return res.redirect("back");
        }

        req.goldAds = res.locals.goldAds = ads;
        Ad.findActiveByVisibility("silver", function(err, ads) {
            if (err) {
                var errorMessage = getErrorMessage(err);
                res.error(errorMessage);
                return res.redirect("back");
            }

            req.silverAds = res.locals.silverAds = ads;
            res.render('index', {
                title: 'Bindie',
                goldAds: req.goldAds,
                silverAds: req.silverAds
            });
        }); 

    });    
};