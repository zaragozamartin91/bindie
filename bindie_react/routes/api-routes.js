exports.config = function (app) {
    var multer = require('multer');
    var upload = multer({
        dest: 'public/songs/'
    });

    /* TODAS LAS RUTAS DE TIPO API TIENEN EL PREFIJO /api INCORPORADO AUTOMATICAMENTE */
    app.post('/api/song/upload', upload.single('song'), function (req, res, next) {
        console.log("/api/song/upload!!!");
        console.log("req.body:");
        console.log(req.body);
        console.log("req.song:");
        console.log(req.song);
        console.log("req.file:");
        console.log(req.file);
        console.log("req.files:");
        console.log(req.files);
        console.log("req.song:");
        console.log(req.song);
        res.send({ data: "ok!" });
    });
};