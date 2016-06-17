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

/*Redirecciona a la vista de registro "register.ejs".*/
exports.form = function(req, res) {
    res.render('register', {
        title: 'Register'
    });
};



/*returns a unified error message from a Mongoose error object.*/
var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }
    return message;
};

/*logica para procesar formulario de register.ejs y registrar un usuario*/
exports.submit = function(req, res, next) {
    console.log("Formulario de usuario subido: ");
    var data = req.body;

    User.findOneByEmail(data.email, function(err, user) {
        if (err) return next(err);

        if (user) {
            res.error("Ya existe un usuario con ese correo!");
            res.redirect("back");
        } else {
            console.log("Guardando usuario:");
            console.log(req.body);
            user = new User(req.body);

            user.save(function(err) {
                if (err) {
                    var message = getErrorMessage(err);
                    res.error(message);
                    return res.redirect('back');
                }

                console.log("Usuario guardado:");
                console.log(user);
                req.session.uid = user._id;
                res.redirect('/');
            });
        }
    });
};