
	//RUTA PRINCIPAL

var express = require('express');
//iniciar variables
var app   = express();//creando la app


app.get('/', ( req, res, next ) => {
	res.status(200).json( {
		ok: true,
		menssage: 'Peticion realizada correctamente'
	} );
});


module.exports = app;