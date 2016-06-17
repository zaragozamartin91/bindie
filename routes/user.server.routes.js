exports.config = function(app) {
    var userController = require('../controllers/user.server.controller');


    /* Los siguientes son funciones API para manipular usuarios... */
    app.get('/api/users', userController.list);
    app.post('/api/users/register', userController.registerApi);



    app.get('/users/register', userController.registerForm);
    app.post('/users/register', userController.registerSubmit);
    app.get('/users/login', userController.loginForm);
    app.post('/users/login', userController.loginSubmit);
    app.get('/users/logout', userController.logout);


    console.log("Rutas de usuario configuradas!");
};