var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var promise = mongoose.connect('mongodb://localhost/test', {
    useMongoClient: true,
    poolSize: 5
}).then(db => {
    console.log(db);
});;

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('meow');
    }
});

console.log(mongoose.connection);