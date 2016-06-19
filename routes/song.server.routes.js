exports.config = function(app) {
    var multer = require('multer');
    var upload = multer({
        dest: 'public/songs/'
    });

    var songController = require('../controllers/song.server.controller');


    /* Los siguientes son rutas API para manipular canciones utilizando AJAX... */
    app.get('/api/songs', songController.list);

    /* Funcion api que busca canciones por genero.*/
    app.get('/api/songs/:genre', songController.searchByGenreApi);


    /* Rutas con vistas para manipular canciones... */
    app.get('/songs/create', songController.createForm);

    /*IMPORTANTE: upload.single('song') indica que desde el formulario llegara un atributo 'song' de tipo input file multipart.
    El atributo name del tag <input> debe ser "song"*/
    app.post('/songs/create', upload.single('song'), songController.createSubmit);


    console.log("Rutas de canciones configuradas!");
};