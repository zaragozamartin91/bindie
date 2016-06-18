var mongoose = require('mongoose');
var User = mongoose.model('User');
var ObjectId = mongoose.Types.ObjectId;

/*El modulo se encargara de asignar el usuario que inicio sesion en req.user para que este disponible para los templates.*/
module.exports = function(req, res, next) {
    var uid = req.session.uid;
    if (!uid) {
        console.log("userLoad::NO HAY uid ASIGNADO!");
        return next();
    }

    User.findOne({
        "_id": new ObjectId(uid)
    }, function(err, user) {
        if (err) {
            console.log("userLoad::OCURRIO UN ERROR EN LA QUERY DE USUARIO");
            return next(err);
        }

        if (user) {
            console.log("userLoad::USUARIO " + uid + " ENCONTRADO!");
        }

        req.user = res.locals.user = user;
        next();
    });
};