var User = require('../models/user');

module.exports = function (apiRouter) {
	//create a user on post and get all users on get
	apiRouter.route('/users')
		.get(function (req, res) {
			User.find(function (err, users) {
				if(err)
					res.send(err);
				else{
					//return the users
					res.json(users)
				}
			});
		});


	apiRouter.route('/users/:user_id')
		//get the user with that id
		.get(function (req, res) {

			User.findOne({_id: req.params.user_id})
				.populate('classes')
				.exec(function (err, user) {
					if (err)
						res.send(err);
					else{
						res.json(user);
					}
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
					else{
						//return a message
						res.json({
							success: true,
							message: 'User updated'
						});
					}
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
				else{
					User.find(function (err, users) {
						//return the users
						res.json({
							users: users,
							message: 'Successfully deleted'
						})
					});
				}
			});
		});

		apiRouter.get('/me', function (req, res) {
			res.send(req.decoded);
		});
}