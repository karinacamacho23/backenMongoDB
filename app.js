//Requiere librerias y modulos
//
var express = require('express');
var mongoose = require ('mongoose'); //Libreria for conect with DB
var bodyParser = require('body-parser');



//iniciar variables
//
var app     = express();//creando la app
const port  = 3000;

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  next();
});

/*Configurando BodyParseer*/
app.use(bodyParser.urlencoded ({ extended : false }))
app.use(bodyParser.json())

/*
ServeIndex para que en el navegador pueda visualizar las carpetas y el desplege 
de las imagenes */

/*var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/upload', serveIndex(__dirname + '/upload'));
NOI SE USARAAA*/
//Rutas Importadas
//
var appRoutes = require ('./routes/app');
var usuarioRoutes = require ('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


// Coneccion a la Base de Datos- conect with DB
// 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {
	if ( err ) throw err; // Aqui para el proceso , rompiendo la ejecucion

	/*if ( res ) esta demas*/
	console.log ('Base de Datos : \x1b[32m%s\x1b[0m', 'on line');
});







//Rutas
//

app.use( '/usuario', usuarioRoutes );
app.use( '/medico', medicoRoutes );
app.use( '/hospital', hospitalRoutes );
app.use( '/login', loginRoutes );
app.use( '/busqueda', busquedaRoutes );
app.use( '/upload', uploadRoutes );
app.use( '/img', imagenesRoutes );


//Siempre éste es de ultimo
app.use('/', appRoutes);  //Usando mildware
	/*Dice: 

	app.use (quiero que al hacer match en / quiero que ejecutes el appRoutes)
*/






















//Escuchando las peticiones en el porto seleccionado
app.listen( port, () => {
	console.log(`Escuchando desde  http://localhost: ${port} : \x1b[33m%s\x1b[0m`, 'on line');
} );


