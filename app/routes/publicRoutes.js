var User = require('../models/user'),
	jwt = require('jsonwebtoken'),
	config = require('../../config');
	supersecret = config.secret;

function sendToken (msg, user, res) {
	var token = jwt.sign({
					id: user._id,
					name: user.name,
					username: user.username,
					roles: user.roles
				}, supersecret, {
					expiresInMinutes: 1440
				});

	res.json({
		success: true,
		message: msg,
		token: token
	});
}

module.exports = function (apiRouter) {
	apiRouter.post('/authenticate', function (req, res) {
		User.findOne({
			username: req.body.username
		}).select('name username password roles').exec(function (err, user) {
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
					sendToken('Successfully passed a token', user, res);
				}
			}
		})
	});

	apiRouter.route('/register')
		.post(function (req, res) {
			var user = new User();

			user.name = req.body.name;
			user.username =  req.body.username;
			user.password = req.body.password;

			user.save(function(err){
				if (err){
					//duplicate entry
					if(err.code == 11000)
						return res.json({success: false, message: "Username already exists."});
					else
						return res.send(err);
				}
				sendToken('Registration successful', user, res);
			})
		})
}