
	//RUTA USUARIO

var express = require('express');
var bcrypt = require('bcryptjs'); //libreria de ecriptacion de contraseña
var jwt = require('jsonwebtoken');
/*var SEED = require('../config/config').SEED;*/
var mdAutenticacion = require('../milddleware/autenticacion');

//iniciar variables
var app   = express();//creando la app

var Usuario = require('../models/usuario'); 



// =====================================
// Obtener todos  los usuarios
// =====================================

app.get('/', ( req, res, next ) => {
	//El Usuario.find({}) me busca toda la informacion
	Usuario.find({ }, 'nombre email img role')
		.exec(
			(err, usuarios) => {
			if (err){
				return res.status(500).json( {
					ok: false,
					mensaje: 'Error al cargar usuarios',
					errors: err
				} );		
			}
			res.status(200).json( {
				ok: true,
				usuarios
			} );
	});

	
});
// =====================================
// End Obtener todos  los usuarios
// =====================================


// =====================================
// vERIFICAR Token (creacion del Milldeware)

//Se define aqui. Porque desde aca vienen las peticiones que 
//requieren permisos token
// =====================================

/*
app.use('/', ( req, res, next )=>{

	//Recibiendo el token
	var token = req.query.token;

	//verificar validez
	jwt.verify( token, SEED, ( err, decoded ) =>{
		if ( err ) {
			return res.status(401).json( {
				ok: false,
				mensaje: 'Error! No se reconoce el token',
				errors: err
			} );
		}

		next();// para que el token proceda a las demas peticiones que necesitan el token
	} );

})
*/

// =====================================
// End vERIFICAR Token (creacion del Milldeware)
// =====================================


// =====================================
// Actualizar un usuario
// =====================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
	//escuchar por param el id
	var id = req.params.id;
	var body = req.body;
	//se usa el findOne para buscar
	Usuario.findById( id, ( err, usuario ) => {
		if (err){
			return res.status(500).json( {
				ok: false,
				mensaje: 'Error al buscar usuario',
				errors: err
			} );		
		}
		if ( !usuario ) {
			return res.status(400).json( {
				ok: false,
				mensaje: 'Error: no existe el usuario '+ id,
				errors: { message: 'No esciste un usuario con ese ID' }
			} );
		}
		/*nota: si no hay usuario retorna null*/
		//var body = req.body;

		//modifico nombre:body.nombre
		usuario.nombre = body.nombre;
		usuario.email = body.email;
		usuario.role = body.role;
		//save()
		usuario.save( (err, usuarioGuardado) =>{
			if (err){
				return res.status(400).json( {
					ok: false,
					mensaje: 'Error al Guardar los cambios',
					errors: err
				} );		
			}

			usuarioGuardado.password = ' :) '; //======>
//>>>>>>Este cambio es solo para que se muestre cuando retorna mas no se 
//>>>>>> Guarda dentro de la BD . Ya que se hizo despues del usuario.save()

			res.status(200).json({
				ok: true,
				usuario : usuarioGuardado,
				message : 'Cambios Guardados Exitosamente'
			});
		} );
	});
	
	
});


// =====================================
// End Actualizar un usuario
// =====================================


/* PARA PROBAR E IMPRIMIR PO
	res.status(200).json( {
		ok: true,
		id
	} );
*/




// =====================================
// Crear un nuevo usuario
// =====================================
app.post('/', mdAutenticacion.verificaToken , (req, res) => {
	var body = req.body;
	var usuario = new Usuario( {
		nombre : body.nombre,
		email  : body.email,
		password : bcrypt.hashSync(body.password, 10), //usando la libreria BCRYPT.JS
		img    : body.img,
		role   : body.role
	} );

	usuario.save( (err, usuarioGuardado) =>{
		if (err){
			return res.status(400).json( {
				ok: false,
				mensaje: 'Error al crear usuario',
				errors: err
			} );		
		}
		res.status(201).json( {
			ok: true,			
			usuario : usuarioGuardado,
			usuarioToken : req.usuario
		} );
	} );
});

// =====================================
// End Crear un nuevo usuario
// =====================================

// =====================================
// Delete usuario
// =====================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)  => {
	var id = req.params.id;
	Usuario.findByIdAndRemove(id, ( err, usuarioBorrado ) => {
		if (err){
			return res.status(400).json( {
				ok: false,
				mensaje: 'Error al Guardar los cambios',
				errors: err
			} );		
		}

		if ( !usuarioBorrado ) {
			return res.status(400).json( {
				ok: false,
				mensaje: 'No existe un usuario con ese ID',
				errors: { message : 'No existe un usuario con ese ID' }
			} );
		}

		res.status(200).json({
			ok: true,
			usuario : usuarioBorrado,
			message : 'Usuario Eliminado Correctamente'
		});
	});
} );

// =====================================
// End Delete usuario
// =====================================
module.exports = app;

