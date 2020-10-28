
	//RUTA upload

var express = require('express');
//iniciar variables

//Librer. express-fileupload
var  fileUpload  =  require ( 'express-fileupload' ) ; 
var fs = require('fs');//lib para manejar arechivos FileSystem


var Usuario = require('../models/usuario'); 
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');



var app   = express();//creando la app

//default options
app.use( fileUpload ( ) );


app.put('/:tipo/:id', ( req, res, next ) => {


	var tipo = req.params.tipo;
	var id = req.params.id;

	tipoColecc = [ 'hospitales', 'medicos', 'usuarios' ];

	if ( tipoColecc.indexOf( tipo ) < 0 ) {
		return res.status( 400 ).json({
    		ok: false,
    		mensaje: 'No admitido',
    		error: { message: 'Tipo de coleccion no es valida' }
    	});
	}


	if ( !req.files ) { 
    	return res.status( 400 ).json({
    		ok: false,
    		mensaje: 'No selecciono nada',
    		error: { message: 'No se cargan los arch volver a cargar!' }
    	});
  	}


  	//Obtener nombre de archivo
  	var archivo = req.files.imagen; //captura el archivo
  	var nombreCortado = archivo.name.split('.');
  	//me captura el nombre del arch en un arrays,
  	//cada elem estar: ej-. hola.mundo.jpg
  	//nombreCortado=['hola','mundo','jpg']
  	var extension = nombreCortado [nombreCortado.length -1];

  	//extensiones permitida
  	extensionesValidas = ['png','jpeg','jpg','gif', 'PNG','JPEG','JPG','GIF'];


  	if ( extensionesValidas.indexOf( extension ) < 0 ) {
  		return res.status( 400 ).json({
    		ok: false,
    		mensaje: 'No valido',
    		error: { message: 'Extensiones permitidas son: '+ extensionesValidas }
    	});
  	}




  		//nombrfe personalizad : 173182312-123.png
  		var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;
  		//direccion a moverla
  		var path = `./upload/${ tipo }/${ nombreArchivo }`;

  		archivo.mv( path, err   => {
  			if ( err ) { 
    			return res.status( 400 ).json({
    				ok: false,
    				mensaje: 'Error al Mover Archivo',
    				error: { message: 'Error al Mover Archivo' }
    			});
  			}
  		});

  		subirPorTipo ( id, tipo, nombreArchivo, res );

/*

		*/
});




function subirPorTipo ( id, tipo, nombreArchivo, res ) {

	if ( tipo === 'usuarios' ) {
		//importar libreria del modulo Usuario para poder buscar
		Usuario.findById( id, (err, usuario ) =>{
			if ( err ) {
				return res.status(400).json({
					ok: true,
					mensaje: 'No existe usuario'
				});
			}
			
			var pathViejo = './upload/usuarios/' + usuario.img;
			//si existe elimina la imagen anterior



			if (fs.existsSync(pathViejo)){
				fs.unlink(pathViejo, (err) =>{
					if (err) {
						return res.status(400).json({
							ok: false,
							mensaje: 'No se pudo eliminar Existente',
							error: { message: 'Archivo existente no se puede eliminar' }
						})
						
					}
				}); //borra imagen 
			}

			usuario.img = nombreArchivo;

			usuario.save(( err, usuarioActualizado ) =>{
				return res.status(200).json( {
					ok: true,
					message: 'Imagen de Usuario Actualizada',
					usuario : usuarioActualizado
				});	
			})


		});

	}


	if ( tipo === 'hospitales' ) {
		

		Hospital.findById(id, ( err, hospital ) => {
			if ( err ) throw err;

			var pathViejo = './upload/hospitales/' + hospital.img;

			if (fs.existsSync(pathViejo)) {
				fs.unlink(pathViejo, (err) => {
					if ( err ) {
						return res.status(400).json({
							ok: false,
							mensaje: 'No se pudo eliminar Existente',
							error: { message: 'Archivo existente no se puede eliminar' }
						})						
					}
				});
			}
			hospital.img = nombreArchivo;

			hospital.save(( err, hospitalActualizado ) => {
				return res.status(200).json( {
					ok: true,
					message: 'Imagen del Hospital Actualizada',
					hospital : hospitalActualizado
				});
			});
		});
	}

	if ( tipo === 'medicos' ) {
		

		Medico.findById(id, ( err, medico ) => {
			if ( err ) throw err;

			var pathViejo = './upload/medicos/' + medico.img;

			if (fs.existsSync(pathViejo)) {
				fs.unlink(pathViejo, (err) => {
					if ( err ) {
						return res.status(400).json({
							ok: false,
							mensaje: 'No se pudo eliminar Existente',
							error: { message: 'Archivo existente no se puede eliminar' }
						})						
					}
				});
			}
			medico.img = nombreArchivo;

			medico.save(( err, medicoActualizado ) => {
				return res.status(200).json( {
					ok: true,
					message: 'Imagen del Medico Actualizada',
					medico : medicoActualizado
				});
			});
		});
	}



}

module.exports = app;