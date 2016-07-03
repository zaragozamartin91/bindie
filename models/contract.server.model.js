/*DEFINE EL SCHEMA Y REGISTRA EL MODELO DE USUARIO */
// -----------------------------------------------------------------

/*considero que los nombres de bandas deben ser unicos...*/
exports.registerSchema = function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var ContractSchema = new Schema({
        band: {
            type: Schema.Types.ObjectId,
            ref: 'Band'
        },
        location: {
            type: Schema.Types.ObjectId,
            ref: 'Location'
        },
        /*Campo que guarda la fecha de creacion de la banda*/
        created: {
            type: Date,
            default: Date.now
        },
        /*Campo que guarda la fecha del evento*/
        eventDate: {
            type: Date,
            default: Date.now
        },
        /*Campo que guarda la fecha de caducidad del evento*/
        expirationDate: {
            type: Date,
            default: Date.now
        },
        description: {
            type: String,
            default: 'Descripcion no disponible'
        },
        cash: {
            type: Number,
            default: 0
        }
    });

    /*busca contratos de una banda.*/
    ContractSchema.statics.findByBandID = function(name, callback) {
        console.log("Buscando contratos de la banda: " + id);
        this.find({
            band: id
        }, callback);
    };

    /*busca contratos de un lugar.*/
    ContractSchema.statics.findByLocationID = function(name, callback) {
        console.log("Buscando contratos de un lugar: " + name);
        this.find({
            location: id
        }, callback);
    };

    /*A post middleware is defined using the post() method of the schema object*/
    /*esta funcion correra despues de ejecutar save() sobre mongo.*/
    ContractSchema.post('save', function(next) {
        if (this.isNew) {
            console.log('Se creo un nuevo contrato!');
        } else {
            console.log('Se actualizo un contrato!');
        }
    });

    /*This will force Mongoose to include getters when converting the MongoDB document to a JSON representation and will allow the
    output of documents using res.json(). Tambien habilita los campos virtuales como fullName.*/
    ContractSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });

    console.log("Registrando modelo de contratos!");
    mongoose.model('Contract', ContractSchema);
};