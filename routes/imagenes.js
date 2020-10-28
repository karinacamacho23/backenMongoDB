
	//RUTA PRINCIPAL

var express = require('express');
//iniciar variables
var app   = express();//creando la app

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', ( req, res, next ) => {
	
	var tipo = req.params.tipo;
	var img = req.params.img;
	//validar que tipo sea correcto

	var pathImagen = path.resolve( __dirname, `../upload/${tipo}/${img}` );

	if ( fs.existsSync( pathImagen ) ) {
		res.sendFile( pathImagen );
	} else {
		var pathNoImg = path.resolve( __dirname, '../assets/no-img.png' );
		res.sendFile( pathNoImg );
	}
	
});


module.exports = app;