//Requiere librerias y modulos
//
var express = require('express');
var mongoose = require ('mongoose'); //Libreria for conect with DB
var bodyParser = require('body-parser');



//iniciar variables
//
var app     = express();//creando la app
const port  = 3000;


/*Configurando BodyParseer*/
app.use(bodyParser.urlencoded ({ extended : false }))
app.use(bodyParser.json())





//Rutas Importadas
//
var appRoutes = require ('./routes/app');
var usuarioRoutes = require ('./routes/usuario');
var loginRoutes = require('./routes/login')


// Coneccion a la Base de Datos- conect with DB
// 
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {
	if ( err ) throw err; // Aqui para el proceso , rompiendo la ejecucion

	/*if ( res ) esta demas*/
	console.log ('Base de Datos : \x1b[32m%s\x1b[0m', 'on line');
});







//Rutas
//
app.use('/usuario', usuarioRoutes);

app.use('/login', loginRoutes);
app.use('/', appRoutes); //Usando mildware
	/*Dice: 

	app.use (quiero que al hacer match en / quiero que ejecutes el appRoutes)
*/






















//Escuchando las peticiones en el porto seleccionado
app.listen( port, () => {
	console.log(`Escuchando desde  http://localhost: ${port} : \x1b[33m%s\x1b[0m`, 'on line');
} );


