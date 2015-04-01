var User = require('../models/user'),
	jwt = require('jsonwebtoken'),
	config = require('../../config');

var supersecret = config.secret;

module.exports = function (app, express) {
	//get an instance of the express router
	var apiRouter = express.Router();

	apiRouter.post('/authenticate', function (req, res) {
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function (err, user) {
			if(err)
				throw err;
			//no user with that username was found
			if(!user){
				res.json({
					success: false,
					message: 'Authentication failed. User not found'
				})
			}
			else if(user){
				//check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
					res.json({
						success: false,
						message: 'Authentication failed. Password does not match'
					})
				}else{
					//if user is found and password is right
					var token = jwt.sign({
						name: user.name,
						username: user.username
					}, supersecret, {
						expiresInMinutes: 1440
					});

					res.json({
						success: true,
						message: 'Successfully passed a token',
						token: token
					});

				}
			}
		})
	})

	//middleware that is responsible for protecting all routes that will follow it using tokens based authentication
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

	//create a user on post and get all users on get
	apiRouter.route('/users')
		.post(function (req, res) {
			
			//create a new instance of the User Model
			var user = new User();

			//set the users information (comes from the request)
			user.name = req.body.name;
			user.username = req.body.username;
			user.password = req.body.password;

			//save the user a nd check for errors
			user.save(function(err){
				if (err){
					//duplicate entry
					if(err.code == 11000)
						return res.json({success: false, message: "Username already exists"});
					else
						return res.send(err);
				}
				res.json({message: "User created"})
			})
		})
		.get(function (req, res) {
			User.find(function (err, users) {
				if(err)
					res.send(err);

				//return the users
				res.json(users)
			});
		});


	apiRouter.route('/users/:user_id')
		//get the user with that id
		.get(function (req, res) {
			User.findById(req.params.user_id, function (err, user) {
				if(err)
					res.send(err);

				res.json(user);
			})
		})
		//update the user with that id
		.put(function (req, res) {
			User.findById(req.params.user_id, function (err, user) {
				if (err)
					res.send(err)

				//update the users info only if it is new
				if(req.body.name)
					user.name = req.body.name;
				if(req.body.username)
					user.username = req.body.username;
				if(req.body.password)
					user.password = req.body.password;

				//save the user
				user.save(function (err) {
					if(err)
						res.send(err);

					//return a message
					res.json({message: 'User updated'});
				})
			})
		})
		//delete the user with this id
		.delete(function (req, res) {
			User.remove({
				_id: req.params.user_id
			}, function (err, user) {
				if(err)
					return res.send(err);
				res.json({message: 'Successfully deleted'})
			});
		});

	apiRouter.get('/me', function (req, res) {
		res.send(req.decoded);
		console.log('sent');
	});

	return apiRouter;
};