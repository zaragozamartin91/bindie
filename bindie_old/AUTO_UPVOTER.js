var http = require('http');

var mongooseConfig = require('./config/mongoose');
var db = mongooseConfig();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function(chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function() {
        console.log(str);
    });
};

var songId = '578ea240092aa2f8155c2c7a';
var urlPrefix = '/api/songs/upvote/' + songId + '/user/';


User.find({}, function(err, users) {
    users.forEach(function(user) {
        var url = urlPrefix + user._id;

        var options = {
            host: 'localhost',
            port: '3000',
            path: url
        };

        http.request(options, callback).end();
    });
});



