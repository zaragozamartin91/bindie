exports.config = function (app) {
    const path = require('path');
    var formidable = require('formidable');

    /* TODAS LAS RUTAS DE TIPO API TIENEN EL PREFIJO /api INCORPORADO AUTOMATICAMENTE */
    app.post('/api/song/upload/:user', function (req, res, next) {
        var form = new formidable.IncomingForm();
        console.log(req.params.user);

        form.on('fileBegin', function (name, file) {
            console.log("fileBegin!");
            file.path = path.join(__dirname, '..', 'public', 'songs', file.name);
            console.log(`file.path: ${file.path}`);
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
            res.send({ msg: `file ${file.name} uploaded!` });
        });

        form.parse(req);
    });

    app.post('/api/sample/:user', function (req, res, next) {
        console.log(req.body);
        console.log(req.params.user);
        res.send({ data: "ok" });
    });
};