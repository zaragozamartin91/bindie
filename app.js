/*me conecto a la bbdd*/
var mongooseConfig = require('./config/mongoose');
var db = mongooseConfig();


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morganLogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var expressLayouts = require('express-ejs-layouts');

var userLoadMiddleware = require('./lib/userLoad.js');
var messages = require('./lib/messages');
var titleMiddleware = require('./lib/titleMiddleware');

/*inicio express*/
var app = express();

/*cargo las propiedades de configuracion*/
var appConfig = require('./config/appConfig');

// en la carpeta views se guardaran las vistas. Como motor de template se usa EJS.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//aplico modulo de layouts
app.use(expressLayouts);

// Descomentar la siguiente linea de codigo cuando se coloque un logo de la aplicacion en carpeta public/
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morganLogger('dev'));

/*body-parser module provides several middleware to handle request data */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
/*method-override module provides DELETE and PUT HTTP verbs legacy support*/
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/*In this configuration object, the secret property is defined using the configuration file you previously modified. The session
middleware adds a session object to all request objects in your application. Using this session object, you can set or get any 
property that you wish to use in the current session*/
app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: appConfig.sessionSecret
}));


/*cargamos el middleware de usuarios para inyectar el usuario en cada request*/
app.use(userLoadMiddleware);
/*Agregamos el middleware para trabajar con mensajes en cada redirect...*/
app.use(messages);
/*Este middleware establece un title para cada pantalla si es que alguno no fue seteado.*/
app.use(titleMiddleware);


/*Configuro las rutas de la aplicacion.*/
var indexRoutes = require('./routes/index').config(app);
var userRoutes = require('./routes/user.server.routes').config(app);
var bandRoutes = require('./routes/band.server.routes').config(app);
var songRoutes = require('./routes/song.server.routes').config(app);
var locationRoutes = require('./routes/location.server.routes').config(app);
var adRoutes = require('./routes/ad.server.routes').config(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers----------------------------------------------------------------------------------------------

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// FIN DE CONFIGURACION --------------------------------------------------------------------------------------

module.exports = app;

var port = 3000;
app.listen(port, function() {
  console.log("Alicacion levantada en http://localhost:" + port);
});