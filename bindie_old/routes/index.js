exports.config = function(app) {
    var adController = require('../controllers/ad.server.controller');

    /* GET home page. */
    app.get('/', adController.showAds);

};