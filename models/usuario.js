
/*
Se trabaja con mongoose por lo tanto hay que importar su lib*/

var mongoose = require('mongoose');
 
var Schema = mongoose.Schema; // Hacemos el llamado a la funcion esquema para crear nuestro esquema de la coleccion
//====================================
//Definiendo libreria de mongoose UNIQUE
//=====================================
var uniqueValidator = require ('mongoose-unique-validator');
//====================================
//End de libreria de mongoose UNIQUE
//=====================================


/*Definimos la instancia Schema:

Es importa nte definirla :::::: 

	1.. nombrecoleccminusculaSchema = new Schema( {
		RECIBE UN OBJETO JAVASCRIPT CON NUESTRA PROPIA CONFIGURACION
	} ); 

	2.. los campos de nuestra coleccion se definen como un arreglo y se validan de una vez
*/
var rolesValidos =  {
	values : ['ADMIN_ROLE', 'USER_ROLE'],
	message: '{VALUE} no es un rol valido'
}
var usuarioSchema = new Schema ( {
	nombre : { type: String, required: [true, 'El nombre es necesario'] }, /*require: true si solo tiene esa validacion*/
	email : { type: String, unique: true,  required: [true, 'El correo es necesario'] }, 
	password : { type: String, required: [true, 'La contraseña es necesaria'] },
	img : { type: String  }, /* o  required: false*/
	role : { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }
} );
//================================
//Usando Plugins de mongoose UNIQUE
//================================
usuarioSchema.plugin(uniqueValidator, { message : '{PATH} debe ser unico' });

//================================
//Usando Plugins de mongoose UNIQUE
//================================
//Para usar el esquema fuera del archivo lo debo exportar
module.exports = mongoose.model('Usuario', usuarioSchema);
  /*   (nombre que quiero para el model  ,  objeto que debe relacionarse)  */ 

