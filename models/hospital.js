  var mongoose = require('mongoose');
 
var Schema = mongoose.Schema; 
//====================================
//Definiendo libreria de mongoose UNIQUE
//=====================================
//var uniqueValidator = require ('mongoose-unique-validator');




var hospitalSchema = new Schema({
	nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
	img: { type: String, required: false },
	usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });







/*usuarioSchema.plugin(uniqueValidator, { message : '{PATH} debe ser unico' });
*/
//Para usar el esquema fuera del archivo lo debo exportar
module.exports =	mongoose.model('Hospital',	hospitalSchema);