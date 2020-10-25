var express = require('express');
var bcrypt = require('bcryptjs'); //libreria de ecriptacion de contraseña

//JsonWebToken===============
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

//para el login usamos la libreria usuario
var Usuario = require('../models/usuario');


	
//
app.post('/', (req, res) =>{
//escuchar body 
	var body = req.body;

	//buscar y comparar datos desencriptando el password
	//Comparando Email
	Usuario.findOne({ email: body.email }, ( err, usuarioDB ) =>{
		if ( err ) {
			return res.status(500).json( {
				ok: false,
				mensaje: 'Error en la busqueda',
				errors: err
			} );
		}

		if( !usuarioDB ){
			return res.status(400).json( {
				ok: false,
				mensaje: 'Datos incorrectos -email',
				errors: err
			} );
		}

		//procede a comparar Password. Esta funcion retorna true o false
		// y solo me comprara un string ya encriptado con otro que procede a ser
		//encriptado
		if ( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {
			return res.status(400).json( {
				ok: false,
				mensaje: 'Datos incorrectos -password',
				errors: err
			} );
		}

		//CREAR UN TOKERN
		var token = jwt.sign( { usuario: usuarioDB }, SEED, { expiresIn: 14400 });

		res.status(200).json( {
			ok: true,
			usuarioDB,
			token,
			id: usuarioDB._id
		} );
		
	});

});















module.exports = app;