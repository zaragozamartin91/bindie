/*DEFINE EL SCHEMA Y REGISTRA EL MODELO DE USUARIO */
// -----------------------------------------------------------------

/*considero que los nombres de bandas deben ser unicos...*/
exports.registerSchema = function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var BandSchema = new Schema({
        name: {
            type: String,
            unique: 'Ya existe una banda con ese nombre!',
            required: 'El nombre de la banda no puede ser vacio!'
        },
        /*Campo que guarda la fecha de creacion de la banda*/
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
        }],
        description: {
            type: String,
            default: 'Descripcion no disponible'
        }
    });

    /*busca una unica banda por nombre.*/
    BandSchema.statics.findOneByName = function(name, callback) {
        console.log("Buscando banda: " + name);
        this.findOne({
            name: name
        }, callback);
    };

    /*A post middleware is defined using the post() method of the schema object*/
    /*esta funcion correra despues de ejecutar save() sobre mongo.*/
    BandSchema.post('save', function(next) {
        if (this.isNew) {
            console.log('Se creo una banda nueva!');
        } else {
            console.log('Se actualizo una banda!');
        }
    });

    /*This will force Mongoose to include getters when converting the MongoDB document to a JSON representation and will allow the
    output of documents using res.json(). Tambien habilita los campos virtuales como fullName.*/
    BandSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });

    console.log("Registrando modelo de bandas!");
    mongoose.model('Band', BandSchema);
};