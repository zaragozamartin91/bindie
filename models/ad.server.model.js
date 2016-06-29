/*DEFINE EL SCHEMA Y REGISTRA EL MODELO DE UN LUGAR/NEGOCIO/BAR */
// -----------------------------------------------------------------


exports.registerSchema = function() {
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ObjectId = Schema.Types.ObjectId;

    var AdSchema = new Schema({
        /*considero que los nombres de los lugares deben ser unicos...*/
        created: {
            type: Date,
            default: Date.now
        },
        adType: {
            type: String,
            enum: ['place', 'band']
        },
        user: {
            type: ObjectId,
            ref: 'User'
        },
        duration: {
            type: Number
        },
        visibility: {
            type: Number
        }
    });

    AdSchema.statics.findOneByUser = function(user, callback) {
        console.log("Aviso por usuario: " + user);
        this.findOne({
            user: user
        }, callback);
    };

    AdSchema.post('save', function(next) {
        if (this.isNew) {
            console.log('Se creo un lugar nuevo!');
        } else {
            console.log('Se actualizo un lugar!');
        }
    });

    AdSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });

    console.log("Registrando modelo de avisos!");
    mongoose.model('Ad', AdSchema);
};