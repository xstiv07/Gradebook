var User = require('../models/user'),
	jwt = require('jsonwebtoken'),
	config = require('../../config');
	supersecret = config.secret;

function sendToken (msg, user, res) {
	var token = jwt.sign({
					id: user._id,
					fname: user.fname,
					isAdmin: user.roles.indexOf('Admin') != -1,
					isInstructor: user.roles.indexOf('Instructor') != -1
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
			email: req.body.email
		}).select('fname password roles').exec(function (err, user) {
			if(err)
				throw err;
			//no user with that username was found
			if(!user){
				res.json({
					success: false,
					message: 'Authentication failed.'
				})
			}
			else if(user){
				//check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
					res.json({
						success: false,
						message: 'Authentication failed.'
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

			user.fname = req.body.fname;
			user.lname = req.body.lname;
			user.email =  req.body.email;
			user.password = req.body.password;

			user.save(function(err){
				if (err){
					//duplicate entry
					if(err.code == 11000){
						console.log(err)
						return res.json({success: false, message: "Email already exists."});
					}
					else
						return res.send(err);
				}
				sendToken('Registration successful', user, res);
			})
		})
}