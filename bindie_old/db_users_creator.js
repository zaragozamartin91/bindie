var mongooseConfig = require('./config/mongoose');
var db = mongooseConfig();

var mongoose = require('mongoose');

var User = mongoose.model('User');

for (var i = 1; i <= 10; i++) {
    var user = new User({
        name: 'User_' + i,
        email: 'user' + i + '@gmail.com',
        password: 'user' + i
    });
    user.save(function(err) {
    });
}