var GlobalConfig = require('../GlobalConfig');
GlobalConfig.setProfile('test');

var SessionManager = require('./SessionManager');

SessionManager.createDatabase((err, results) => {
    console.error(err);
    console.log(results);
});