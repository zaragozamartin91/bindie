exports.config = function(app) {
    var bandController = require('../controllers/band.server.controller');


    /* Los siguientes son rutas API para manipular bandas utilizando AJAX... */
    app.get('/api/bands', bandController.list);


    /* Rutas con vistas para manipular bandas... */
    app.get('/bands/create', bandController.createForm);
    app.post('/bands/create', bandController.createSubmit);


    console.log("Rutas de bandas configuradas!");
};