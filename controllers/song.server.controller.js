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

    User.findBands(userId, function(err, bands) {
        console.log("bandas: " + bands);
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
        filePath: songFile.filename
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