exports.config = function (app) {
    const path = require('path');
    var formidable = require('formidable');

    /* TODAS LAS RUTAS DE TIPO API TIENEN EL PREFIJO /api INCORPORADO AUTOMATICAMENTE */
    app.post('/api/song/upload', (req, res, next) => {
        var form = new formidable.IncomingForm();
        form.parse(req);

        form.on('fileBegin', function (name, file) {
            console.log("fileBegin!");
            file.path = path.join(__dirname, '..', 'public', 'songs', file.name);
            console.log(`file.path: ${file.path}`);
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
            res.send({msg:`file ${file.name} uploaded!`});
        });

        console.log(`user: ${req.body.user}`);
    });
};