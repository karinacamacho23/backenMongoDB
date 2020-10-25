
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

// =====================================
// vERIFICAR Token (creacion del Milldeware)
// =====================================
exports.verificaToken = function ( req, res, next ) {

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
		/*return res.status(200).json( {
			ok: true,
			decoded: decoded
		} );*/
		
		req.usuario = decoded.usuario;//para q la informacion del usuario 
									//este disponible para cualquier peticion
									
		next();// para que el token proceda a las demas peticiones que necesitan el token

	});

} 





// =====================================
// End vERIFICAR Token (creacion del Milldeware)
// =====================================
