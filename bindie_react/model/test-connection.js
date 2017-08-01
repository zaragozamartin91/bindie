var User = require('./User');
var bcrypt = require('bcryptjs');

let user = {
    name: "mateo",
    email: "mateo@zaragoza",
    password: "roberto"
}

//User.fromObject(user).create((err, res) => {
//    if (err) return console.error(err);
//    console.log(res);
//})

User.fromObject(user).authenticate((err, res) => {
    if (err) return console.error(err);
    console.log("AUTENTICACION OK!");
    console.log(res);
});

