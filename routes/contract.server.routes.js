exports.config = function(app) {
    var contractController = require('../controllers/contract.server.controller');

    app.get('/api/contracts/user/:userId', contractController.searchByUserApi);
    app.get('/contracts/notifications', contractController.notifications);

    app.post('/api/contracts/reject/:contractId', contractController.reject);

    console.log("Rutas de contratos configuradas!");
};