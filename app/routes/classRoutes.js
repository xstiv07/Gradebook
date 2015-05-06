var Class = require('../models/class'),
	deepPopulate = require('mongoose-deep-populate'),
	User = require('../models/user');

module.exports = function (apiRouter) {
	apiRouter.route('/classes')
		.get(function (req, res) {
			//sending all classes
			Class.find()
			.populate('instructor')
			.exec(function (err, classes) {
				if(err)
					res.send(err);
				res.send(classes);
			});
		})

		.post(function (req, res) {
			var gClass = new Class();

			gClass.crn = req.body.crn;
			gClass.name = req.body.name;
			gClass.term = req.body.term;
			gClass.instructor = req.body.instructor;

			//save a class
			gClass.save(function (err) {
				if (err)
					res.send(err);
				else
					res.json({
						success: true,
						message: 'Successfully created'
					});
			})
		});

		
	apiRouter.route('/classes/:class_id')

		.put(function (req,res) {
			Class.findById(req.params.class_id, function (err, gclass) {
				if (err)
					res.send(err);

				if(req.body.name)
					gclass.name = req.body.name;
				if(req.body.crn)
					gclass.crn = req.body.crn;
				if (req.body.term)
					gclass.term = req.body.term;

				gclass.save(function (err) {
					if (err)
						res.send(err);
					else
						res.json({
							success: true,
							message: 'Successfully updated'
						})
				})
			})

		})
		//removing a class also deletes all references of the user
		.delete(function (req, res) {

			Class.findByIdAndRemove(req.params.class_id, function (err, gClass) {
				if (err)
					res.send(err);
				gClass.remove();
			}).then(function () {
				Class.find(function (err, classes) {
					res.json({
						classes: classes,
						success: true
					});
				});
			});
		});

	apiRouter.get('/classes/instructorInfo/:instructor_id', function (req, res) {

		Class.find({instructor: req.params.instructor_id})
		.deepPopulate('assignments.submissions.files users instructor')
		.exec(function (err, classes) {
			if (err)
				res.send(err);
			else
				res.send(classes);
		});
	});

	apiRouter.route('/classes/addStudents/:class_id')
		.post(function (req, res) {

			Class.findById(req.params.class_id, function (err, gClass) {
				if (err)
					res.send(err);

				//find all requested users and add them to class
				for (var i in req.body) {
					User.update({
						_id: req.body[i]},
						{$addToSet: {classes: gClass}}, function (err) {
							if (err)
								res.send(err)
						});

					Class.update({
						_id: gClass._id},
						{$addToSet: {users: req.body[i]}}, function (err) {
							if (err)
								res.send(err);
						});
				};
				
				res.json({
					success: true,
					message: "Successfully added"
				});
			})
		})

	apiRouter.route('/classes/enrolledStudents/:class_id')
		.get(function (req, res) {
			Class.findOne({
				_id: req.params.class_id
			})
			.populate('users')
			.exec(function (err, gClass) {
				if (err){
					res.send(err);
				}
				else{
					res.json({
						className: gClass.name,
						students: gClass.users
					});
				};
			});
		})
		//unenroll user from a class
		.put(function (req, res) {
			Class.update({
				_id: req.params.class_id},
				{$pull: {users: req.body.userId}}, function (err) {
					if (err)
						res.send(err);
			});
			User.update({
				_id: req.body.userId},
				{$pull: {classes: req.params.class_id}}, function (err) {
					if (err)
						res.send(err);
			});

			//get students for a class and return
			Class.findOne({
				_id: req.params.class_id
			})
			.populate('users')
			.exec(function (err, gClass) {
				if (err)
					res.send(err);
				else
					res.json(gClass.users);
			});
		
		})
}