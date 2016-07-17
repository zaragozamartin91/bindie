exports.config = function(app) {
    var contractController = require('../controllers/contract.server.controller');

    app.get('/api/contracts/user/:userId', contractController.searchByUserApi);
    app.get('/contracts/notifications', contractController.notifications);

    console.log("Rutas de contratos configuradas!");
};