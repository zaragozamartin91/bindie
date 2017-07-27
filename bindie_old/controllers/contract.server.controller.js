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
        if (err) {
            return res.json({
                error: err
            });
        }

        console.log("CONTRATO " + contractId + " RECHAZADO!");
        return res.json({
            ok: 'rechazado'
        });
    });
};


exports.accept = function(req, res) {
    var userId = req.session.uid;

    if (!userId) {
        return res.json({
            error: 'Necesita iniciar sesion para aceptar un contrato!'
        });
    }

    var contractId = req.params.contractId;

    if (!contractId || contractId === "") {
        return res.json({
            error: 'Id de contrato no indicado'
        });
    }

    var data = req.body;

    console.log("CONTRATO A ACEPTAR: " + contractId);

    // bandId: "<%=band_id %>",
    // locationId: "<%=location._id %>",
    // year: "<%=yearEventDate %>",
    // month: "<%=monthEventDate %>",
    // day: "<%=dayEventDate %>",
    // hours: "<%=hoursEventDate %>",
    // minutes: "<%=minutesEventDate %>"

    Band.findOne({
        _id: new ObjectId(data.bandId)
    }, function(err, band) {
        if(!band) {
            return res.json({
                error: "Banda " + data.bandId + " no encontrada!"
            });
        }

        Location.findOne({
            _id: new ObjectId(data.locationId)
        }, function(err, location) {
            if(!location) {
                return res.json({
                    error: "Lugar " + data.locationId + " no encontrado!"
                });
            }

            User.searchBandFans(data.bandId, function(err, userIds) {
                console.log("USUARIOS FANATICOS DE " + band.name);
                console.log(userIds);

                var eventData = {
                    name: 'Banda ' + band.name + ' toca en ' + location.name,
                    description: 'Te invitamos a escuchar a ' + band.name + ' en ' + location.name,
                    location: new ObjectId(location._id),
                    date: new Date(data.year, data.month, data.day, data.hours, data.minutes, 0, 0),
                    members: userIds,
                    band: new ObjectId(band._id)
                };

                var newEvent = new Event(eventData);

                newEvent.save(function(err) {
                    if (err) {
                        console.log("OCURRIO UN ERROR AL CREAR UN NUEVO EVENTO:");
                        console.log(err);
                        return res.json({
                            error: err
                        });
                    }

                    console.log("SE GUARDO EL EVENTO: ");
                    console.log(newEvent);

                    Contract.update({
                        _id: contractId
                    }, {
                        $set: {
                            status: 'accepted'
                        }
                    }, function(err) {
                        console.log("CONTRATO " + contractId + " ACEPTADO!");

                        return res.json({
                            ok: 'aceptado'
                        });
                    });


                });
            });
        });
    });

};