exports.config = function(app) {
    var userController = require('../controllers/user.server.controller');

    /* Funcion api para obtener todos los usuarios. */
    app.get('/api/users', userController.list);

    app.get('/users/register', userController.form);

    app.post('/users/register', userController.submit);

    console.log("configurando rutas de usuario!");
};