exports.config = function(app) {
    var contractController = require('../controllers/contract.server.controller');

    app.get('/api/contracts/user/:userId', contractController.searchByUserApi);

    console.log("Rutas de contratos configuradas!");
};