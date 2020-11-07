var express = require('express');
var bcrypt = require('bcryptjs'); //libreria de ecriptacion de contraseña

//JsonWebToken===============
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

//para el login usamos la libreria usuario
var Usuario = require('../models/usuario');

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;

const { OAuth2Client } = require ( 'google-auth-library' );
const client = new OAuth2Client(CLIENT_ID);

//========================
//Autenticacion Google	
//========================

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return {
  	verificacion: payload.email_verified,
  	email: payload.email,
  	name: payload.name,
  	picture: payload.picture,
  	userId: payload.sub,
  	google: true

  }
  // If request specified a G Suite |domain:
  // const domain = payload['hd'];
}
//verify().catch(console.error);


app.post('/google', async(req, res) =>{


	var token = req.body.token;
	var usuarioGoogle = await verify(token)
		//.then o cath porque el await al igual que el async regresa
		//una promesa.. El await depende del async
		.catch( err => {
				return res.status(403).json({
				ok: false,
				mensaje: 'token no valido'
			});
		});

		//Una vez que este en sesion se debe
		//buscar usuario para ver si esta o no autenticado en la app

		Usuario.findOne( { email: usuarioGoogle.email }, ( err, usuarioDB ) => {
			if ( err ) {
				return res.status(500).json( {
					ok: false,
					mensaje: 'Error en la busqueda',
					errors: err
				} );
			}

			if ( usuarioDB ) {
				//si existe el usuario se presenta dos casos:
				//1. si no se autentico con Google retorna
				//2. si ya esta registrado solo se reautentica

				if ( usuarioDB.google === false ) { //se debe cancelar el proceso
					
					return res.status(400).json( {
						ok: false,
						mensaje: 'Debe usar su autenticacion normal',
					} );
				} else {
					//Ya existe y esta en mi base de datos. Se genera otro token
					var token = jwt.sign( { usuario: usuarioDB }, SEED, { expiresIn: 14400 });

					res.status(200).json( {
						ok: true,
						usuario: usuarioDB,
						token,
						_id: usuarioDB._id
					} );
				} //fin If-else
			} else {
				//Si no esta autenticado se crea una nueva autenticacion
				var usuario = new Usuario();  
				usuario.nombre = usuarioGoogle.name;
				usuario.email = usuarioGoogle.email;
				usuario.img = usuarioGoogle.picture;
				usuario.google = usuarioGoogle.google;
				usuario.password = ':)';

				usuario.save(( err, usuarioDB ) => {
					//VALIDAR EL ERR

					
					res.status(200).json( {
						ok: true,
						usuario: usuarioDB,
						token,
						_id: usuarioDB._id
					} );
				})

			}//fin If-else
			

		})
/*
  		return res.status(200).json({
			ok: true,
			mensaje: 'OKK!!',
			usuarioGoogle
		});*/

  
      
      // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3] }); carga útil constante = ticket . getPayload (); const userid = payload [ 'sub' ]; // Si la solicitud especifica un dominio de G Suite: // const domain = payload ['hd']; } verificar (). captura ( consola . error );
  
  
  
  
  



	
})

//========================
//Autenticacion Nomral	
//========================
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
			usuario: usuarioDB,
			token,
			_id: usuarioDB._id
		} );
		
	});

});















module.exports = app;