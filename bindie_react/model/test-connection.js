var SessionManager = require('./SessionManager');
var User = require('./User');

User.createTable(err => {
    console.error(err);
});