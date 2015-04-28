var jwt = require('jsonwebtoken'),
	config = require('../../config'),
	supersecret = config.secret,
	isAuthorized = false;

module.exports = function (apiRouter) {
	apiRouter.use(function (req, res, next) {
		//check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		//decode token
		if(!token){
			return res.status(403).send({
				success: false,
				message: 'No token provided'
			});
		}else{
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
			
		}
	})

// defining access to routes based on user roles here

	apiRouter.all('/users', function (req, res, next) {
		var currentUser = req.decoded;

		if (currentUser.isInstructor || currentUser.isAdmin)
			isAuthorized = true;

		if(!isAuthorized)
			res.sendStatus(404)
		next();
	});

	apiRouter.all('/classes', function (req, res, next) {
		var currentUser = req.decoded;

		if (currentUser.isInstructor || currentUser.isAdmin)
			isAuthorized = true;

		if(!isAuthorized)
			res.sendStatus(404)

		next();
	});

	apiRouter.all('/assignments', function (req, res, next) {
		var currentUser = req.decoded;

		if (currentUser.isInstructor || currentUser.isAdmin)
			isAuthorized = true;

		if(!isAuthorized)
			res.sendStatus(404)

		next();
	});
}