const express = require('express');
const router = express.Router();
const path = require('path');
const formidable = require('formidable');
const songsDir = path.join(__dirname, '..', 'public', 'songs');

/* TODAS LAS RUTAS DE TIPO API TIENEN EL PREFIJO /api INCORPORADO AUTOMATICAMENTE */
router.post('/song/upload/:user', (req, res, next) => {
    let form = new formidable.IncomingForm();
    console.log(req.params.user);
    console.log("body");
    console.log(req.body);

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

router.post('/sample/:user', (req, res, next) => {
    console.log(req.body);
    console.log(req.params.user);
    res.send({ data: "ok" });
});

module.exports = router;