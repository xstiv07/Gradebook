var User = require('../models/user'),
	Class = require('../models/class'),
	Assignment = require('../models/assignment'),
	Submission = require('../models/submission'),
	async = require('async'),
	deepPopulate = require('mongoose-deep-populate');

module.exports = function (apiRouter) {
	//create a user on post and get all users on get
	apiRouter.route('/users')
		.get(function (req, res) {
			console.log('getting user info')
			User.find(function (err) {
				if(err)
					res.send(err);
			}).exec(function (err, users) {
				res.json(users);
			})
		});


	apiRouter.get('/users/fullInfo/:user_id', function (req, res) {

		User.findOne({_id: req.params.user_id})
		.deepPopulate('classes.assignments.submissions.files classes.instructor', {
			populate: {'classes.assignments.submissions': {match: {user: req.params.user_id.toString()}}}
		})
		.exec(function (err, user) {
			if (err)
				res.send(err);
			res.send(user);
		});
	});

	apiRouter.get('/calendarInfo/:user_id', function (req, res) {
		//if user is instructor select his classes
		//else select classes only from current user and populate them with assignment start date ,end date and title.

		User.findOne({_id: req.params.user_id})
		.deepPopulate('classes.assignments')
		.exec(function (err, user) {
			if(err)
				res.send(err)

			var calendarData = [];


			for (var i = 0; i < user.classes.length; i++) {
				var gClass = user.classes[i];
				for (var i = 0; i < gClass.assignments.length; i++) {
					var assignm = gClass.assignments[i];

					var obj = {
						title: gClass.name + " " + gClass.term + " " + assignm.name,
						start: assignm.dateAssigned.toUTCString(),
						end: assignm.dateDue.toUTCString(),
					}

					calendarData.push(obj)
				};

			};
			res.json(calendarData)
		})
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