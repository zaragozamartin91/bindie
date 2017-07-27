exports.config = function(app) {
    var eventController = require('../controllers/event.server.controller');


    /* Los siguientes son rutas API para manipular eventos utilizando AJAX... */
    /*Obtiene todos los eventos*/
    app.get('/api/events', eventController.list);
    /*Obtiene eventos a partir de nombres parecidos de la misma (serviria para una busqueda de autocompletar)*/
    app.get('/api/events/name/:eventName?',eventController.getByName);

    app.get('/api/events/id/:eventId', eventController.getById);


    /* Rutas con vistas para manipular eventos... */
    app.get('/events/create', eventController.createForm);
    app.post('/events/create', eventController.createSubmit);
    //app.get('/events/browse', eventController.browseEvents);


    console.log("Rutas de eventos configuradas!");
};
