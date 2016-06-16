/*CARGA LAS CONFIGURACIONES DE MONGOOSE.
CARGA LOS SCHEMAS Y MODELOS
SE CONECTA A LA BBDD*/
// ----------------------------------------------------------------------

var mongoose = require('mongoose');
var appConfig = require('./appConfig');

/*config carga las variables de configuracion apropiadas de acuerdo al ambiente (por ejemplo, si NODE_ENV es 'development',
entonces carga configs de ./env/development.js). config.db tiene la url de la bbdd.*/

module.exports = function() {
    var db = mongoose.connect(appConfig.db);

    require('../models/user.server.model.js');

    return db;
};