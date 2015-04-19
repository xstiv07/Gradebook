var User = require('../models/user'),
	deepPopulate = require('mongoose-deep-populate');

module.exports = function (apiRouter) {
	//create a user on post and get all users on get
	apiRouter.route('/users')
		.get(function (req, res) {
			User.find(function (err) {
				if(err)
					res.send(err);
			}).exec(function (err, users) {
				res.json(users);
			})
		});


	apiRouter.get('/users/fullInfo/:user_id', function (req, res) {
		User.findOne({
			_id: req.params.user_id
		}).deepPopulate('classes.assignments.submissions').exec(function (err, user) {
			if (err)
				res.send(err);
			else{
				res.json(user);
			};
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
					};
				});
			});
		})
		//delete the user with this id
		.delete(function (req, res) {
			User.findByIdAndRemove(req.params.user_id, function (err, user) {
				if (err)
					res.send(err);
				user.remove();
			}).then(function () {
				User.find(function (err, users) {
					res.json({
						users: users,
						success: true,
						message: 'Successfully deleted'
					});
				});
			});
		});

	apiRouter.get('/me', function (req, res) {
		res.send(req.decoded);
	});

	//set roles for the selected user
	apiRouter.post('/users/setRole/:user_id', function (req, res) {
		User.update({
			_id: req.params.user_id},
			{roles: req.body}, function (err) {
				if (err)
					res.send(err)
			});				
		
		res.json({
			success: true
		});

	});
}