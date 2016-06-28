exports.config = function(app) {
    var bandController = require('../controllers/band.server.controller');


    /* Los siguientes son rutas API para manipular bandas utilizando AJAX... */
    /*Obtiene todas las bandas*/
    app.get('/api/bands', bandController.list);
    /*Obtiene bandas a partir de nombres parecidos de la misma (serviria para una busqueda de autocompletar)*/
    app.get('/api/bands/name/:bandName?',bandController.getByName);

    app.get('/api/bands/id/:bandId',bandController.getById);


    /* Rutas con vistas para manipular bandas... */
    app.get('/bands/create', bandController.createForm);
    app.post('/bands/create', bandController.createSubmit);
    app.get('/bands/browse', bandController.browseBands);


    console.log("Rutas de bandas configuradas!");
};