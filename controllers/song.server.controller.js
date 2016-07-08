var mongoose = require('mongoose');
var User = mongoose.model('User');
var Song = mongoose.model('Song');
var Band = mongoose.model('Band');
var ObjectId = mongoose.Types.ObjectId;

var path = require('path');
var fs = require('fs');
var mm = require('musicmetadata');
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
    var duration = 0;

    mm(fs.createReadStream(songFile.path), {
        duration: true
    }, function(err, metadata) {
        if (err) throw err;

        duration = metadata.duration;

        Band.findOneByName(req.body.band, function(err, band) {
            var song = new Song({
                name: name,
                fileName: songFile.filename,
                genres: req.body.genres,
                duration: duration,
                description: req.body.description,
                band: band._id
            });
            song.save(function(err) {
                if (err) {
                    var message = getErrorMessage(err);
                    res.error(message);
                    return res.redirect("back");
                }

                res.success("Cancion subida exitosamente:");
                console.log(song);
                return res.redirect("back");
            });
        });

    });
};


exports.searchByGenreApi = function(req, res) {
    var genre = req.params.genre;

    Song.searchByGenre(genre, function(err, songs) {
        console.log("CANCIONES DE GENERO " + genre + " ENCONTRADAS: " + songs);
        res.json(songs);
    });
};

exports.searchByNameApi = function(req, res) {
    var name = req.params.name;

    Song.searchByName(name, function(err, songs) {
        console.log("CANCIONES DE NOMBRE " + name + " ENCONTRADAS: " + songs);
        res.json(songs);
    });
};

exports.searchByBandNameApi = function(req, res) {
    var bandName = req.params.bandName;

    Song.searchByBandName(bandName, function(err, songs) {
        console.log("CANCIONES DE BANDA " + bandName + " ENCONTRADAS: " + songs);
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


exports.getById = function(req, res) {
    var songId = req.params.songId;

    Song.findOne({
        _id: new ObjectId(songId)
    }, function(err, song) {
        if (err) {
            console.error("Algo salio mal buscando la cancion: " + songId);
            return res.json({
                error: err
            });
        }

        res.json(song);
    });
};

exports.apiUpvote = function(req, res) {
    var userId = req.params.userId || req.session.uid;
    var songId = req.params.songId;

    console.log("apiUpvote::userId: " + userId);
    console.log("apiUpvote::songId: " + songId);

    if (!userId || !songId) {
        return res.json({
            error: "No se pasaron los IDs de cancion y usuario para votar!"
        });
    }

    Song.findOne({
        _id: new ObjectId(songId)
    }, function(err, song) {
        if (err || !song) {
            console.error("Algo salio mal buscando la cancion: " + songId);
            return res.json({
                error: err
            });
        }

        song.addUpvote(userId);
        song.save();
        res.json(song);
    });
};

exports.browseFavorite = function(req, res, next) {
    if (!req.session.uid) {
        res.error("Debe iniciar sesion para ver sus favoritos!");
        return res.redirect("back");
    }

    Song.searchByLike(req.session.uid, function(err, songs) {
        if (err) {
            var msg = getErrorMessage(err);
            res.error(msg);
            return res.redirect('back');
        }

        req.songs = res.locals.songs = songs;

        res.render('myMusic', {
            title: 'Mi musica',
            songs: songs
        });
    });
};