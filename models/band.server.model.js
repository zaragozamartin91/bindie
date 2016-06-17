/*DEFINE EL SCHEMA Y REGISTRA EL MODELO DE USUARIO */
// -----------------------------------------------------------------

exports.registerSchema = function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var BandSchema = new Schema({
        name: String,
        /*The created date field should be initialized at creation time and save the time the user document
        was initially created*/
        created: {
            type: Date,
            default: Date.now
        },
        genres: [{
            type: String
        }],
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    });

    /*A post middleware is defined using the post() method of the schema object*/
    /*esta funcion correra despues de ejecutar save() sobre mongo.*/
    BandSchema.post('save', function(next) {
        if (this.isNew) {
            console.log('A new band was created!');
        } else {
            console.log('An band was updated!');
        }
    });

    /*This will force Mongoose to include getters when converting the MongoDB document to a JSON representation and will allow the
    output of documents using res.json(). Tambien habilita los campos virtuales como fullName.*/
    BandSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });

    console.log("registering Band model!");
    mongoose.model('Band', BandSchema);
};