var mongoose = require('mongoose');
var User = mongoose.model('User');
var Band = mongoose.model('Band');
var Location = mongoose.model('Location');
var Event = mongoose.model('Event');
var Song = mongoose.model('Song');
var Contract = mongoose.model('Contract');
var ObjectId = mongoose.Types.ObjectId;



exports.notifications = function(req, res) {
    if (!req.session.uid) {
        res.error("Necesita iniciar sesion para ver notificaciones!");
        return res.redirect("back");
    }

    var userId = req.session.uid;

    Contract.searchByUser(userId, function(contracts) {
        res.render('contractNotifications', {
            title: 'Notificaciones de contrato',
            contracts: contracts
        });
    });
};


exports.searchByUserApi = function(req, res) {
    var userId = req.params.userId;

    Contract.searchByUser(userId, function(err, contracts) {
        console.log("CONTRATOS DE " + userId);
        console.log(contracts);
        return res.json(contracts);
    });
};