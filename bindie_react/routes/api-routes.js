const express = require('express');
const router = express.Router();
const path = require('path');
const formidable = require('formidable');
//const songsDir = path.join(__dirname, '..', 'public', 'songs');
const songsDir = path.join(__dirname, '..', 'songs');
const filesystem = require("fs");
const url = require('url');

/* TODAS LAS RUTAS DE TIPO API TIENEN EL PREFIJO /api INCORPORADO AUTOMATICAMENTE */

router.post('/song/upload/:band', (req, res, next) => {
    console.log(`req.params.band: ${req.params.band}`);
    console.log(`SONGS DIR: ${songsDir}`);

    let form = new formidable.IncomingForm();

    form.on('fileBegin', function (name, file) {
        console.log("fileBegin!");
        file.path = path.join(songsDir, file.name);
        console.log(`file.path: ${file.path}`);
    });

    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
        res.send({ msg: `file ${file.name} uploaded!` });
    });

    form.parse(req);
});

router.post('/allSongs', (req, res, next) => {
    filesystem.readdir(songsDir, (err, songs) => {
        if (err) console.log(err);
        console.log(songs);
        res.send({ err, songs });
    });
});

router.get('/song/:song', function (req, res) {
    console.log(`SONG: ${req.params.song}`);

    if (req.headers.referer) {
        console.log(`REFERER: ${req.headers.referer}`);

        let pathname = url.parse(req.headers.referer).pathname;
        console.log(`PATHNAME: ${pathname}`);

        let songPath = path.join(songsDir, req.params.song);
        console.log(`SONG PATH: ${songPath}`);

        if (pathname == "/main") res.sendFile(songPath);
        else res.end("NO DEBERIAS ESTAR AQUI");
    } else {
        res.end("NO DEBERIAS ESTAR AQUI");
    }
});

module.exports = router;