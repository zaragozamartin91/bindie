exports.config = function(app) {
    var userController = require('../controllers/user.server.controller');


    /* Los siguientes son rutas API para manipular usuarios utilizando AJAX... */
    app.get('/api/users/', userController.list);
    app.post('/api/users/register', userController.registerApi);
    app.get('/api/users/id/:userId', userController.getById);
    app.get('/api/users/id/:userId/bands', userController.getBands);
    app.get('/api/users/email/:userEmail?', userController.getByEmail);


    /* Las siguientes son rutas de vistas */
    app.get('/users/register', userController.registerForm);
    app.post('/users/register', userController.registerSubmit);
    app.get('/users/login', userController.loginForm);
    app.post('/users/login', userController.loginSubmit);
    app.get('/users/logout', userController.logout);
    app.get('/users/bands', userController.browseMyBands);
    app.get('/users/locations', userController.browseMyLocations);
    app.get('/users/events', userController.browseMyEvents);
	app.get('/users/musicNotifications', userController.getNotificationMusic);
    app.get('/users/invitedEvents', userController.browseInvitedEvents);
    app.get('/users/otherEvents', userController.browseAllEvents);

    console.log("Rutas de usuario configuradas!");
};
