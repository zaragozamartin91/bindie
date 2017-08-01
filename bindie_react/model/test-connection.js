var User = require('./User');
var bcrypt = require('bcryptjs');

//  new User(null, "nicolas", "nico@sibi", "pepe").create((err, result) => {
//      console.log(result);
//  });

User.getByEmail('nico@sibi', (err, users) => {
    console.log(users);
    console.log(bcrypt.compareSync("pepe", users[0].password));
});

var hash = bcrypt.hashSync('bacon', 10);
console.log(bcrypt.compareSync("bacon", hash));