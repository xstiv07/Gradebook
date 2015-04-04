var jwt = require('jsonwebtoken'),
	config = require('../../config'),
	supersecret = config.secret;

module.exports = function (apiRouter) {
	apiRouter.use(function (req, res, next) {
		//check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		//decode token
		if(token){
			//verifies secret and checks expiration
			jwt.verify(token, supersecret, function (err, decoded) {
				if (err){
					return res.status(403).send({
						success: false,
						message: 'Failed to authenticate token'
					});
				}else{
					//if everything is good save to request to use in other routes
					req.decoded = decoded;
					next();
				}
			});
		}else{
			//if there is no token retuen http response of 403 and error message
			return res.status(403).send({
				success: false,
				message: 'No token provided'
			});
		}
	});
}