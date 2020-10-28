 
	//RUTA USUARIO

var express = require('express');

/*var SEED = require('../config/config').SEED;*/
var mdAutenticacion = require('../milddleware/autenticacion');

//iniciar variables
var app   = express();//creando la app

var Medico = require('../models/medico'); 



// =====================================
// Obtener todos  los Hospitales
// =====================================

app.get('/', ( req, res, next ) => {
	var desde = req.query.desde || 0;
	desde = Number(desde);
	//El Hospital.find({}) me busca toda la informacion
	Medico.find({ })
		.skip(desde)
		.limit( 5 )
		.populate('usuario', 'nombre email')//muestra el obejto usuario con los campos selec
		.populate('hospital')//miestra el objeto completo de hospital
		.exec(
			(err, medicos) => {
			if (err){
				return res.status(500).json( {
					ok: false,
					mensaje: 'Error al cargar Medicos',
					errors: err
				} );		
			}
			Medico.count({}, (err, cont) =>{
				res.status(200).json( {
					ok: true,
					medicos,
					total: cont
				} );
			})
			
	});	 
});
// =====================================
// End Obtener todos  los Medicos
// =====================================


// =====================================
// Actualizar un Medico
// =====================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
	//escuchar por param el id
	var id = req.params.id;
	var body = req.body;
	//se usa el findOne para buscar
	Medico.findById( id, ( err, medico ) => {
		if (err){
			return res.status(500).json( {
				ok: false,
				mensaje: 'Error al buscar medico',
				errors: err
			} );		
		}
		if ( !medico ) {
			return res.status(400).json( {
				ok: false,
				mensaje: 'Error: no existe el medico '+ id,
				errors: { message: 'No existe un medico con ese ID' }
			} );
		}
		/*nota: si no hay usuario retorna null*/
		//var body = req.body;

		//modifico nombre:body.nombre
		medico.nombre = body.nombre;
		medico.usuario = req.usuario._id;//relacion con la coleccion usuarios
		//save()
		medico.hospital = body.hospital;//relacion con la col. Hospital
		//Guardar Cambios
		medico.save( (err,medicoGuardado) =>{
			if (err){
				return res.status(400).json( {
					ok: false,
					mensaje: 'Error al Guardar los cambios',
					errors: err
				} );		
			}


			res.status(200).json({
				ok: true,
				medico : medicoGuardado,
				message : 'Cambios Guardados Exitosamente'
			});
		} );
	});
	
	
});


// =====================================
// End Actualizar un Medico
// =====================================



// =====================================
// Crear un nuevo medico
// =====================================
app.post('/', mdAutenticacion.verificaToken , (req, res) => {
	var body = req.body;
	var medico = new Medico( {
		nombre : body.nombre,
		usuario: req.usuario._id,
		hospital: body.hospital
	} );

	medico.save( (err, medicoGuardado) =>{
		if (err){
			return res.status(400).json( {
				ok: false,
				mensaje: 'Error al crear medico',
				errors: err
			} );		
		}
		res.status(201).json( {
			ok: true,			
			medico : medicoGuardado,
			 
		} );
	} );
});

// =====================================
// End Crear un nuevo medico
// =====================================

// =====================================
// Delete medico
// =====================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)  => {
	var id = req.params.id;
	Medico.findByIdAndRemove(id, ( err, medicoBorrado ) => {
		if (err){
			return res.status(400).json( {
				ok: false,
				mensaje: 'Error al Borrar medico',
				errors: err
			} );		
		}

		if ( !medicoBorrado ) {
			return res.status(400).json( {
				ok: false,
				mensaje: 'No existe un medico con ese ID',
				errors: { message : 'No existe un medico con ese ID' }
			} );
		}

		res.status(200).json({
			ok: true,
			usuario : medicoBorrado,
			message : 'Medico Eliminado Correctamente'
		});
	});
} );

// =====================================
// End Delete hospital
// =====================================
module.exports = app;

