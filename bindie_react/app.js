var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var session = require('express-session');
//var MySQLStore = require('express-mysql-session')(session);
//var SessionManager = require('./model/SessionManager');
const MongoStore = require('connect-mongo')(session);
const MongooseConfig = require('./model/mongoose-config');

var viewRoutes = require('./routes/view-routes');
var apiRoutes = require('./routes/api-routes');

/* ------------------------------------------------------------------------------------------- */

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


MongooseConfig.config(db => {
  // db es una conexion lista para usar con MongoDb

  /* CONFIGURACION DE SESION ------------------------------------------------------------------------ */
  /* PARA MAS INFORMACION SOBRE LA CONFIGURACION DE LA SESION, VISITAR:
  https://github.com/expressjs/session  */


  /* PARA MAS INFORMACION SOBRE SESSION STORES, VISITAR:
  https://github.com/expressjs/session#compatible-session-stores
  https://www.npmjs.com/package/express-mysql-session  
  https://www.npmjs.com/package/connect-mongo */
  /* Las cookies duraran una hora */
  const cookieMaxAge = 1000 * 60 * 60;
  var sess = {
    secret: 'bindie rules',
    store: new MongoStore({ mongooseConnection: db }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: cookieMaxAge
    }
  }
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
  app.use(session(sess));

  /* CONFIGURACION DE PATHS -------------------------------------------------------------------------- */

  /* LOS RECURSOS ESTATICOS DEBEN ACCEDERSE USANDO EL PATH APROPIADO. 
  NO ES POSIBLE NAVEGARLOS COMO ESTRUCTURA DE DIRECTORIO */
  app.use(express.static('public'));

  app.use('/', viewRoutes);
  app.use('/api', apiRoutes);

  /* MANEJO DE ERRORES ------------------------------------------------------------------------------ */

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    console.log("DEVELOPMENT ENVIRONMET ENABLED");
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });


  module.exports = app;

  var port = 8080;
  console.log(`ESCUCHANDO EN PUERTO ${port}`);
  app.listen(port);
});

