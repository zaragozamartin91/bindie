exports.config = function(app) {
    var userController = require('../controllers/user.server.controller');

    /* Funcion api para obtener todos los usuarios. */
    app.get('/api/users', userController.list);

    app.get('/users/register', userController.registerForm);
    app.post('/users/register', userController.registerSubmit);


    app.get('/users/login', userController.loginForm);
    app.post('/users/login', userController.loginSubmit);
    app.get('/users/logout', userController.logout);


    console.log("Rutas de usuario configuradas!");
};