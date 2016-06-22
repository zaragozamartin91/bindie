/*DEFINE EL SCHEMA Y REGISTRA EL MODELO DE UN LUGAR/NEGOCIO/BAR */
// -----------------------------------------------------------------


exports.registerSchema = function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var PlaceSchema = new Schema({
        /*considero que los nombres de los lugares deben ser unicos...*/
        name: {
            type: String,
            unique: 'Ya existe un lugar con ese nombre!',
            required: 'El nombre del lugar no puede ser vacio!'
        },
        created: {
            type: Date,
            default: Date.now
        },
        /*tipo de establecimiento*/
        placeType: {
            type: String,
            enum: ['bar', 'empresa', 'boliche']
        },
        /*usuarios apoderados del lugar*/
        owners: [{
            type: ObjectId,
            ref: 'User'
        }],
        address: {
            type: String,
            default: "SIN DIRECCION"
        },
        /*votos positivos de un lugar. Para evitar que se vote dos veces, se registran quienes dieron votos positivos.*/
        upvotes: [{
            type: ObjectId,
            ref: 'User'
        }],
    });

    /*FALTA TESTEAR SI FUNCIONA...*/
    PlaceSchema.methods.addUpvote = function(voter, callback) {
        var voterId = voter._id ? voter._id : voter;

        if( this.upvotes.indexOf(voterId) < 0 ) {
            this.upvotes.push(new ObjectId(voterId));
        }

        this.save(callback);
    };

    /*busca un lugar unico por nombre.*/
    PlaceSchema.statics.findOneByName = function(name, callback) {
        console.log("Buscando lugar: " + name);
        this.findOne({
            name: name
        }, callback);
    };

    PlaceSchema.statics.searchByType = function(type, callback) {
        if (!type || type === "") {
            type = "any";
        }

        this.find({
            placeType: type
        }, callback);
    };

    PlaceSchema.statics.searchByOwner = function(owner, callback) {
        if (!owner) {
            this.find({}, callback);
        } else {
            var ownerId = owner._id ? new ObjectId(owner._id) : new ObjectId(owner);

            this.find({
                owners: {
                    $elemMatch: {
                        $eq: ownerId
                    }
                }
            }, callback);
        }
    };

    PlaceSchema.post('save', function(next) {
        if (this.isNew) {
            console.log('Se creo un lugar nuevo!');
        } else {
            console.log('Se actualizo un lugar!');
        }
    });

    PlaceSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });

    console.log("Registrando modelo de lugares!");
    mongoose.model('Place', PlaceSchema);
};