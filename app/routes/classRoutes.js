var Class = require('../models/class'),
	User = require('../models/user');

module.exports = function (apiRouter) {
	apiRouter.route('/classes')
		.get(function (req, res) {
			//sending all classes
			Class.find(function (err, classes) {
				if (err)
					res.send(err);
				else{
					//return classes
					res.json(classes);
				}
			})
		})

		.post(function (req, res) {
			var gClass = new Class();

			gClass.crn = req.body.crn;
			gClass.name = req.body.name;
			gClass.description = req.body.description;

			//save a class
			gClass.save(function (err) {
				if (err)
					res.send(err);
				else
					res.json({success: true});
			})
		});

		//removing a class also deletes all references of the user
	apiRouter.route('/classes/:class_id')
		.delete(function (req, res) {

			Class.findByIdAndRemove(req.params.class_id, function (err, gClass) {
				if (err)
					res.send(err);
				gClass.remove();
			}).then(function () {
				Class.find(function (err, classes) {
					res.json({
						classes: classes,
						message: 'Successfully deleted',
						success: true
					});
				});
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
					success: true
				});
			})
		})

	apiRouter.route('/classes/enrolledStudents/:class_id')
		.get(function (req, res) {
			Class.findOne({_id: req.params.class_id})
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

			res.json({
				success: true
			});
		})
}