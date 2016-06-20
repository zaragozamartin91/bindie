var mongoose = require('mongoose');
var User = mongoose.model('User');
var Song = mongoose.model('Song');
var Band = mongoose.model('Band');
var ObjectId = mongoose.Types.ObjectId;

var path = require('path');
var fs = require('fs');
var join = path.join;



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


exports.list = function(req, res) {
    Song.find({}, function(err, songs) {
        if (err) return res.json({
            error: err
        });
        return res.json(songs);
    });
};


exports.createForm = function(req, res, next) {
    var userId = req.session.uid;

    if (!userId) {
        res.error('Debe iniciar sesion para poder subir una cancion!');
        return res.redirect('back');
    }

    User.findBands(userId, function(err, bands) {
        console.log("bandas: " + bands);
        if (!bands || !bands.length) {
            res.error("No perteneces a ninguna banda!");
            return res.redirect('back');
        }

        req.bands = res.locals.bands = bands;

        res.render('songUpload', {
            title: 'Subir cancion',
            bands: bands
        });
    });
};

exports.createSubmit = function(req, res, next) {
    var songDir = join('public', 'songs');

    console.log("req.file:");
    console.log(req.file);
    console.log("req.body:");
    console.log(req.body);

    var songFile = req.file;
    var name = req.body.name;

    var song = new Song({
        name: name,
        fileName: songFile.filename,
        genres: req.body.genres
    });
    song.save(function(err) {
        if (err) {
            var message = getErrorMessage(err);
            res.error(message);
            return res.redirect("back");
        }

        res.message("Cancion subida exitosamente!");
        return res.redirect("back");
    });
};


exports.searchByGenreApi = function(req, res) {
    var genre = req.params.genre;

    Song.searchByGenre(genre, function(err, songs) {
        console.log("Canciones de genero " + genre + " encontradas: " + songs);
        res.json(songs);
    });
};


exports.browse = function(req, res) {
    if (!req.session.uid) {
        res.error("Debe iniciar sesion para buscar musica!");
        return res.redirect("back");
    }

    res.render('browseSongs', {
        title: 'Buscar canciones'
    });
};