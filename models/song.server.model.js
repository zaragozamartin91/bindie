/*DEFINE EL SCHEMA Y REGISTRA EL MODELO DE USUARIO */
// -----------------------------------------------------------------

/*considero que los nombres de bandas deben ser unicos...*/
exports.registerSchema = function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var SongSchema = new Schema({
        name: {
            type: String,
            required: 'El nombre de la cancion no puede ser vacio!'
        },
        /*Campo que guarda la fecha de creacion de la banda*/
        created: {
            type: Date,
            default: Date.now
        },
        genres: [{
            type: String
        }],
        description: {
            type: String,
            default: "Descripcion no disponible"
        },
        band: {
            type: ObjectId,
            ref: 'Band'
        },
        /*nombre del archivo de la cancion*/
        fileName: {
            type: String
        },
        /*votos positivos de una cancion. Para evitar que se vote dos veces, se registran quienes dieron votos positivos.*/
        upvotes: [{
            type: ObjectId,
            ref: 'User'
        }],
    });

    /*FALTA TESTEAR SI FUNCIONA...*/
    SongSchema.methods.addUpvote = function(voter, callback) {
        var voterId = voter._id ? voter._id : voter;

        if (this.upvotes.indexOf(voterId) < 0) {
            this.upvotes.push(new ObjectId(voterId));
        }

        this.save(callback);
    };

    /*busca una unica banda por nombre.*/
    SongSchema.statics.findOneByNameAndBand = function(name, bandId, callback) {
        console.log("Buscando cancion: " + name);
        this.findOne({
            name: name,
            band: new ObjectId(bandId)
        }, callback);
    };

    SongSchema.post('save', function(next) {
        if (this.isNew) {
            console.log('Se creo una cancion nueva!');
        } else {
            console.log('Se actualizo una cancion!');
        }
    });

    SongSchema.statics.searchByGenre = function(genre, callback) {
        if (!genre || genre === "" || genre == "*" || genre == "any") {
            this.find({}, callback);
        } else {
            this.find({
                genres: {
                    $elemMatch: {
                        $eq: genre
                    }
                }
            }, callback);
        }
    };

    SongSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });

    console.log("Registrando modelo de canciones!");
    mongoose.model('Song', SongSchema);
};