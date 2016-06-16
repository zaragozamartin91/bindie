var User = require('mongoose').model('User');

exports.list = function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) {
            console.error("Something went wrong!");
            return next(err);
        }

        res.json(users);
    });
};