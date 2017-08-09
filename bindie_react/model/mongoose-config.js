const mongoose = require('mongoose');

/* While mpromise is sufficient for basic use cases, advanced users may want to plug in their favorite ES6-style promises library like bluebird, 
or just use native ES6 promises. Just set mongoose.Promise to your favorite ES6-style promise constructor and mongoose will use it. */
mongoose.Promise = global.Promise;

function config(callback) {
    let promise = mongoose.connect('mongodb://localhost/test', {
        useMongoClient: true,
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

// promise.then(function (db) {
//     console.log("Registrando schemas...");

//     const UserSchema = require('./UserMongo');

//     UserSchema.registerSchema(db);
//     require('./Band').registerSchema(db);
//     require('./Song').registerSchema(db);
//     require('./Advertisement').registerSchema(db);
//     require('./Location').registerSchema(db);
//     require('./Contract').registerSchema(db);
//     require('./Event').registerSchema(db);

//     const User = mongoose.model('User');
//     let user = new User({ name: "mateo", email: "mateo@zaragoza.com", password: "Roberto" });
//     //user.save((err, res) => {
//     //    console.error(err);
//     //    console.log(res);
//     //})
//     User.findOne({ email: user.email }, (err, res) => {
//         console.log("auth: " + res.authenticate("Roberto"));
//         console.log(res);
//     });
// });


