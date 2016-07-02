/* 
> CARGA LAS CONFIGURACIONES DE MONGOOSE.
> CARGA LOS SCHEMAS Y MODELOS
> SE CONECTA A LA BBDD*/
// ----------------------------------------------------------------------

var mongoose = require('mongoose');
var appConfig = require('./appConfig');


module.exports = function() {
    var db = mongoose.connect(appConfig.db);

    require('../models/user.server.model.js').registerSchema();
    require('../models/band.server.model.js').registerSchema();
    require('../models/song.server.model.js').registerSchema();
    require('../models/ad.server.model.js').registerSchema();
	require('../models/location.server.model.js').registerSchema();

    return db;
};