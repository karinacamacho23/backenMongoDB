
	//RUTA BUSQUEDA

var express = require('express');
//iniciar variables
var app   = express();//creando la app

//Importando collecciones
var Hospital = require('../models/hospital');
var Medico   = require('../models/medico');
var Usuario  = require('../models/usuario');

//================================================
//Busqueda General
//================================================
app.get('/todo/:busqueda', ( req, res, next ) => {
	var busqueda = req.params.busqueda;
	//para hacer flexible la busqueda tipo 'click=Onchange' se deb:
	var regex = new RegExp( busqueda, 'i' );// Expresion regular de javascript
											// el 'i' es para omitir si es mayuscu o minusc
	
	var Coleccion = Hospital;
	var Coleccion1= Medico;


	//PROMISE.ALL:
//Manda un arreglo de promesas y las ejecutas.

	Promise.all( [

		buscarColeccion ( busqueda, regex, Coleccion ),//hospital
		buscarColeccion ( busqueda, regex, Coleccion1 ),//medico
		buscarUsuarios  ( busqueda, regex )            //usario

	] )
		.then( respuestas => {
			res.status(200).json({
				ok: true,
				hospital: respuestas[0],// respuesta de la promesa1
				medico: respuestas[1] , // respuesta de la promesa2
				usuario: respuestas[2]   // respuesta de la promesa2  	
			});
			

		}) ;


/*	buscarHospitales ( busqueda, regex )
		.then( busqhosp => {
			
			res.status(200).json( {
				ok: true,
				busqhosp : busqhosp
			} );
		});*/
	
});

//================================================
//Busqueda Especifica
//================================================

app.get('/todo/coleccion/:tabla/:busqueda', ( req, res ) => {
	var tabla = req.params.tabla;
	var busqueda = req.params.busqueda;

	var regex = new RegExp( busqueda, 'i' );
	var promesa;

	switch( tabla ) {
		case 'usuario':
			promesa = buscarUsuarios( busqueda, regex );
			break;

		case 'medico':
			promesa = buscarColeccion( busqueda, regex, Medico );
			break;

		case 'hospital':
			promesa = buscarColeccion( busqueda, regex, Hospital );
			break;

		default:
			return res.status(400).json({
				ok: false,
				mensaje : 'Las tablas de busquedas solo son hospital, usuario o medico',
				error: { message: 'Tipo de tabal no valido' }
			});
	}
	promesa.then( data => {
		res.status(200).json({
			ok: true,
			[tabla]: data //la tabla en corchetes es cod javascript 
			//lo relaciona con la tabla que el usuario coloca
		} );
	});

});


function buscarColeccion ( busqueda, regex, Colecc ) {

	return new Promise ( ( resolve, reject ) => {

		Colecc.find({ nombre: regex }, ( err, coleccion ) => {
			if ( err ){
				reject( 'Error en la busqueda  ', err );
			} else {
				resolve( coleccion );
			}

		});


	} );

} //fin function


//Buscar Usuario
function buscarUsuarios ( busqueda, regex ) {

	return new Promise ( ( resolve, reject ) => {

		Usuario.find({}, 'nombre email role') 
			.or ([ { 'nombre': regex }, { 'email': regex } ])
			.exec ( ( err, usuarios ) =>{
				if ( err ) {
					reject('Error al cargar usuarios ', err);
				} else {
					resolve(usuarios);
				}
			} );

	} );

} //fin function


/*function buscarHospitales ( busqueda, regex ) {

	return new Promise ( ( resolve, reject ) => {

		Hospital.find({ nombre: regex }, ( err, busqhosp ) => {
			if ( err ){
				reject( 'Error en la busqueda - h ', err );
			} else {
				resolve( busqhosp );
			}

		});


	} );

} */


module.exports = app;