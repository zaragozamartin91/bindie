exports.config = function(app) {
    var locationController = require('../controllers/location.server.controller');


    /* Los siguientes son rutas API para manipular lugares utilizando AJAX... */
    /*Obtiene todos los lugares*/
    app.get('/api/locations', locationController.list);
    /*Obtiene lugares a partir de nombres parecidos de la misma (serviria para una busqueda de autocompletar)*/
    app.get('/api/locations/name/:locationName?',locationController.getByName);

    app.get('/api/locations/id/:locationId',locationController.getById);


    /* Rutas con vistas para manipular lugares... */
    app.get('/locations/create', locationController.createForm);
    app.post('/locations/create', locationController.createSubmit);
    app.get('/locations/browse', locationController.browseLocations);


    /*Ruta para contratar un lugar. La cola del Url debe ser el id del lugar.*/
    app.get('/locations/contract/:locationId', locationController.contract); 
    app.post('/locations/createcontract/', locationController.createContract);   


    console.log("Rutas de lugares configuradas!");
};