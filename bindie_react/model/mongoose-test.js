var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var promise = mongoose.connect('mongodb://localhost/test', {
    useMongoClient: true,
});
promise.then(function (db) {
    /* Use `db`, for instance `db.model()` */
    var teamSchema = new mongoose.Schema({
        country: String,
        GroupName: String
    });
    var Team = db.model('Team', teamSchema);

    var team = new Team({ country: "us", GroupName: "group" });
    team.save((err, team) => {
        console.log("team saved:");
        console.log(team);
    });

    var Teammm = db.model('Team');
    Teammm.findOne({ country: "us" }, (err, team) => {
        console.log("found team: ");
        console.log(team);
    })
});


