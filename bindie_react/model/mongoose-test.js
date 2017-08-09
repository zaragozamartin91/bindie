const MongooseConfig = require('./mongoose-config');

MongooseConfig.config(db => {
    let User = db.model('User');
    let usr = new User({ name: "martin", email: "roberto@accusys.com", password: "pep" });
    usr.save((err, res) => {
        console.error(err);
        console.log(res);
    });
});