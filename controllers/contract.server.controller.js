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

    Contract.searchByUser(userId, function(err, contracts) {
        console.log("CONTRATOS DE USUARIO " + userId);
        console.log(contracts);

        req.contracts = res.locals.contracts = contracts;

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

exports.reject = function(req, res) {
    var contractId = req.params.contractId;

    if (!contractId || contractId === "") {
        return res.json({
            error: 'Id de contrato no indicado'
        });
    }

    var data = req.body;
    var rejectReason = data.rejectReason;

    console.log("CONTRATO A RECHAZAR: " + contractId);
    console.log("RAZON: " + rejectReason);

    Contract.update({
        _id: contractId
    }, {
        $set: {
            status: 'rejected',
            rejectReason: rejectReason
        }
    }, function(err) {
        console.log("CONTRATO RECHAZADO!");
        return res.json({ok:'rechazado'});
    });


    /*    Contract.findOne({
        _id: contractId
    }, function(err, contract) {
        if (err) {
            return res.json(err);
        }

        console.log("CONTRATO ENCONTRADO:");
        console.log(contract);

        contract.type = 'rejected';
        contract.rejectReason = rejectReason;
        contract.save(function(err) {
            if (err) {
                return res.json(err);
            }

            console.log("CONTRATO " + contractId + " RECHAZADO");
            return res.json({
                ok: 'Contrato ' + contractId + ' rechazado'
            });
        });
    });*/
};