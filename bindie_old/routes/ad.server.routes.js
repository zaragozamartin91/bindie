exports.config = function(app) {
    var adController = require('../controllers/ad.server.controller');

    /* Rutas con vistas para manipular bandas... */
    app.get('/ads/create', adController.createForm);
    app.post('/ads/create', adController.createSubmit);
    app.get('/ads/browse', adController.browseAds);
    app.get('/ads/delete/:adId',adController.browseAds);


    console.log("Rutas de ads configuradas!");
};