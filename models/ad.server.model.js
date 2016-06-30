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
        type: {
            type: String,
            enum: ['place', 'band']
        },
        // En StackOverflow se sugiere referenciar a los dos aunque solo se use uno
        band: {
            type: ObjectId,
            ref: 'Band'
        },
        place: {
            type: ObjectId,
            ref: 'Place'
        },         
        user: {
            type: ObjectId,
            ref: 'User'
        },
        duration: {
            type: Number
        },
        visibility: {
            type: String,
            enum: ['gold', 'silver']
        }
    });

    AdSchema.statics.findByUser = function(user, callback) {
        console.log("Aviso por usuario: " + user);
        this.find({
            user: user
        }, callback).populate('band').populate('place').exec(callback);
    };

    AdSchema.post('save', function(next) {
        if (this.isNew) {
            console.log('Se creo un lugar nuevo!');
        } else {
            console.log('Se actualizo un lugar!');
        }
    });

    AdSchema.statics.findActiveByVisibility = function(visibility, callback) {
        console.log("Aviso por usuario: ");
        this.find({
            //created: { $lte: new Date(created.getDate() + duration) },
            visibility: visibility
        }, callback).populate('band').populate('place').exec(callback);
    };    

    AdSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });

    console.log("Registrando modelo de avisos!");
    mongoose.model('Ad', AdSchema);
};