/*DEFINE EL SCHEMA Y REGISTRA EL MODELO DE USUARIO */
// -----------------------------------------------------------------

exports.registerSchema = function() {
    var mongoose = require('mongoose');
    var crypto = require('crypto');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;


    var UserSchema = new Schema({
        name: String,
        email: {
            type: String,
            /*The usage of a match validator here will make sure the email field value matches the given regex expression*/
            match: [/.+\@.+\..+/, "Ingrese una direccion de correo valida!"],
            unique: 'Ya existe un usuario con este correo!',
            required: 'La direccion de correo no puede ser vacia!'
        },
        password: {
            type: String,
            /*Defining a custom validator is done using the validate property. The validate property value should be an array consisting of 
            a validation function and an error message.*/
            validate: [

                function(password) {
                    return password && password.length >= 6;
                },
                'Password deberia ser mas largo...'
            ],
            required: 'Se debe ingresar un password!'
        },
        /*Guarda la fecha de creacion del usuario*/
        created: {
            type: Date,
            default: Date.now
        },
        bands: [{
            type: ObjectId,
            default: [],
            ref: 'Band'
        }],
        /*variable para encriptar el password...*/
        salt: String
    });



    /*To add a static method, you will need to declare it as a member of your schema's statics property*/
    UserSchema.statics.findOneByEmail = function(email, callback) {
        this.findOne({
            email: email
        }, callback);
    };


    /*is used to hash a password string by utilizing Node.js' crypto module*/
    UserSchema.methods.hashPassword = function(password) {
        console.log("ejecutando hashPassword...");
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    };


    /*To add an instance method, you will need to declare it as a member of your schema's methods property*/
    /*accepts a string argument, hashes it, and compares it to the current user's hashed password*/
    UserSchema.methods.authenticate = function(password) {
        return this.password === this.hashPassword(password);
    };

    /*metodo de instancia para agregar una banda a un usuario*/
    UserSchema.methods.addBand = function(band, handleError) {
        var user = this;
        user.bands.push(new ObjectId(band._id));

        user.save(function(err) {
            if (err) {
                console.error("addBand::ocurrio un error al agregar la banda: " + band + "\nal usuario: " + user);
                return handleError(err);
            }

            return user;
        });
    };

    /*pre-save middleware to handle the hashing of your users' passwords.*/
    UserSchema.pre('save', function(next) {
        if (this.password) {
            /*first, it creates an autogenerated pseudo-random hashing salt*/
            this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
            /*then it replaces the current user password with a hashed password using the hashPassword() instance method*/
            this.password = this.hashPassword(this.password);
        }
        next();
    });


    /*A post middleware is defined using the post() method of the schema object*/
    /*esta funcion correra despues de ejecutar save() sobre mongo.*/
    UserSchema.post('save', function(next) {
        if (this.isNew) {
            console.log('Se creo un usuario nuevo!');
        } else {
            console.log('Se actualizo un usuario!');
        }
    });

    /*This will force Mongoose to include getters when converting the MongoDB document to a JSON representation and will allow the
    output of documents using res.json(). Tambien habilita los campos virtuales como fullName.*/
    UserSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });

    console.log("Registrando modelo de usuario!");
    mongoose.model('User', UserSchema);
    /*you defined your UserSchema object using the Schema constructor, and then you used the schema
    instance to define your User model.*/
};