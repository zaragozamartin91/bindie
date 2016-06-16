/*me conecto a la bbdd*/
var mongooseConfig = require('./config/mongoose');
var db = mongooseConfig();


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morganLogger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

/*inicio express*/
var app = express();

/*cargo las propiedades de configuracion*/
var appConfig = require('./config/appConfig');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morganLogger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
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



/*Establezco las rutas base. indexRoutes y userRoutes especifican las sub-rutas.*/
var indexRoutes = require('./routes/index');
var userRoutes = require('./routes/user.server.routes');
app.use('/', indexRoutes);
app.use('/api/users', userRoutes);


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
  console.log("App listening at localhost:3000");
});