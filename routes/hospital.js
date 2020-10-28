
	//RUTA USUARIO

var express = require('express');

/*var SEED = require('../config/config').SEED;*/
var mdAutenticacion = require('../milddleware/autenticacion');

//iniciar variables
var app   = express();//creando la app

var Hospital = require('../models/hospital'); 



// =====================================
// Obtener todos  los Hospitales
// =====================================

app.get('/', ( req, res, next ) => {
	var desde = req.query.desde || 0;
	desde = Number(desde);
	//El Hospital.find({}) me busca toda la informacion
	Hospital.find({ })
		.skip(desde)
		.limit( 5 )
		.populate('usuario', 'nombre email')//muestra el objeto usuario con los campos selec		
		.exec(
			(err, hospitales) => {
			if (err){
				return res.status(500).json( {
					ok: false,
					mensaje: 'Error al cargar Hospitales',
					errors: err
				} );		
			}
			Hospital.count( {}, (err, cont) =>{
				//evaluar el err
				res.status(200).json( {
					ok: true,
					hospitales,
					total: cont
				} );
			} );
			
	});	 
});
// =====================================
// End Obtener todos  los hospitales
// =====================================

// =====================================
// Actualizar un Hospital
// =====================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
	//escuchar por param el id
	var id = req.params.id;
	var body = req.body;
	//se usa el findOne para buscar
	Hospital.findById( id, ( err, hospital ) => {
		if (err){
			return res.status(500).json( {
				ok: false,
				mensaje: 'Error al buscar hospital',
				errors: err
			} );		
		}
		if ( !hospital ) {
			return res.status(400).json( {
				ok: false,
				mensaje: 'Error: no existe el hospital '+ id,
				errors: { message: 'No existe un hospital con ese ID' }
			} );
		}
		/*nota: si no hay usuario retorna null*/
		//var body = req.body;

		//modifico nombre:body.nombre
		hospital.nombre = body.nombre;
		hospital.usuario = req.usuario._id;//relacion con la coleccion usuarios
		//save()
		hospital.save( (err,hospitalGuardado) =>{
			if (err){
				return res.status(400).json( {
					ok: false,
					mensaje: 'Error al Guardar los cambios',
					errors: err
				} );		
			}


			res.status(200).json({
				ok: true,
				hospital : hospitalGuardado,
				message : 'Cambios Guardados Exitosamente'
			});
		} );
	});
	
	
});


// =====================================
// End Actualizar un hospital
// =====================================


/* PARA PROBAR E IMPRIMIR PO
	res.status(200).json( {
		ok: true,
		id
	} );
*/




// =====================================
// Crear un nuevo hospital
// =====================================
app.post('/', mdAutenticacion.verificaToken , (req, res) => {
	var body = req.body;
	var hospital = new Hospital( {
		nombre : body.nombre,
		usuario: req.usuario._id
	} );

	hospital.save( (err, hospitalGuardado) =>{
		if (err){
			return res.status(400).json( {
				ok: false,
				mensaje: 'Error al crear hospital',
				errors: err
			} );		
		}
		res.status(201).json( {
			ok: true,			
			hospital : hospitalGuardado,
			 
		} );
	} );
});

// =====================================
// End Crear un nuevo hospital
// =====================================

// =====================================
// Delete hospital
// =====================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res)  => {
	var id = req.params.id;
	Hospital.findByIdAndRemove(id, ( err, hospitalBorrado ) => {
		if (err){
			return res.status(400).json( {
				ok: false,
				mensaje: 'Error al Borrar',
				errors: err
			} );		
		}

		if ( !hospitalBorrado ) {
			return res.status(400).json( {
				ok: false,
				mensaje: 'No existe un hospital con ese ID',
				errors: { message : 'No existe un hospital con ese ID' }
			} );
		}

		res.status(200).json({
			ok: true,
			usuario : hospitalBorrado,
			message : 'Hospital Eliminado Correctamente'
		});
	});
} );

// =====================================
// End Delete hospital
// =====================================
module.exports = app;

