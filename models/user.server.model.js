/*DEFINE EL SCHEMA Y REGISTRA EL MODELO DE USUARIO */
// -----------------------------------------------------------------
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*MongoDB uses collections to store multiple documents, which aren't required
to have the same structure. However, when dealing with objects, it is sometime
necessary for documents to be similar. Mongoose uses a Schema object to define the
document list of properties, each with its own type and constraints, to enforce the
document structure.*/
var UserSchema = new Schema({
    name: String,
    email: {
        type: String,
        /*The usage of a match validator here will make sure the email field value matches the given regex expression*/
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    },
    password: {
        type: String,
        /*Defining a custom validator is done using the validate property. The validate property value should be an array consisting of 
        a validation function and an error message.*/
        validate: [
            function(password) {
                return password && password.length >= 6;
            },
            'Password should be longer...'
        ]
    },
    /*The created date field should be initialized at creation time and save the time the user document
    was initially created*/
    created: {
        type: Date,
        default: Date.now
    },
});



/*To add a static method, you will need to declare it as a member of your schema's statics property*/
UserSchema.statics.findOneByEmail = function(email, callback) {
    this.findOne({
        /*'i' is to Perform case-insensitive matching*/
        email: new RegExp(email, 'i')
    }, callback);
};




/*To add an instance method, you will need to declare it as a member of your schema's methods property*/
/*accepts a string argument, hashes it, and compares it to the current user's hashed password*/
UserSchema.methods.authenticate = function(password) {
    return this.password === password;
};



/*A post middleware is defined using the post() method of the schema object*/
/*esta funcion correra despues de ejecutar save() sobre mongo.*/
UserSchema.post('save', function(next) {
    if (this.isNew) {
        console.log('A new user was created!');
    } else {
        console.log('An user was updated!');
    }
});

/*This will force Mongoose to include getters when converting the MongoDB document to a JSON representation and will allow the
output of documents using res.json(). Tambien habilita los campos virtuales como fullName.*/
UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});

console.log("registering User model!");
mongoose.model('User', UserSchema);
/*you defined your UserSchema object using the Schema constructor, and then you used the schema
instance to define your User model.*/