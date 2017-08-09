const mongoose = require('mongoose');

/* While mpromise is sufficient for basic use cases, advanced users may want to plug in their favorite ES6-style promises library like bluebird, 
or just use native ES6 promises. Just set mongoose.Promise to your favorite ES6-style promise constructor and mongoose will use it. */
mongoose.Promise = global.Promise;

function config(callback) {
    /* FORMATO DE LA URL:
    mongoose.connect('mongodb://username:password@host:port/database?options...'); */
    let promise = mongoose.connect('mongodb://root:root@localhost/test', {
        useMongoClient: true,
        poolSize: 5
    });
    promise.then(db => {
        registerSchemas(db);
        callback(db);
    });
}

function registerSchemas(db) {
    console.log("REGISTRANDO SCHEMAS");
    require('./UserMongo').registerSchema(db);
    require('./Band').registerSchema(db);
    require('./Song').registerSchema(db);
    require('./Advertisement').registerSchema(db);
    require('./Location').registerSchema(db);
    require('./Contract').registerSchema(db);
    require('./Event').registerSchema(db);
}

exports.config = config;
