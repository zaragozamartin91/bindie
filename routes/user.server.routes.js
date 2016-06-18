exports.config = function(app) {
    var userController = require('../controllers/user.server.controller');


    /* Los siguientes son rutas API para manipular usuarios utilizando AJAX... */
    app.get('/api/users/', userController.list);
    app.post('/api/users/register', userController.registerApi);
    app.get('/api/users/:userId', userController.getById);
    app.get('/api/users/:userId/bands', userController.getBands);


    /* Las siguientes son rutas de vistas */
    app.get('/users/register', userController.registerForm);
    app.post('/users/register', userController.registerSubmit);
    app.get('/users/login', userController.loginForm);
    app.post('/users/login', userController.loginSubmit);
    app.get('/users/logout', userController.logout);


    console.log("Rutas de usuario configuradas!");
};