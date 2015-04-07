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

	apiRouter.route('/classes/:class_id')
		.delete(function (req, res) {
			Class.remove({
				_id: req.params.class_id
			}, function (err) {
				if(err)
					res.send(err);

				Class.find(function (err, classes) {
					res.json({
						classes: classes,
						message: 'Successfully deleted'
					});
				})
			});
		});


		//change tomorrow.
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
						})

					Class.update({
						_id: gClass._id},
						{$addToSet: {users: req.body[i]}}, function (err) {
							if (err)
								res.send(err);
						})
				};
				if (err)
					res.send(err);
				else{
					res.json({
					success: true,
					message: "Successfully added."
				});	
				}
				
			})
		})
		.delete(function (req, res) {
			Class.findById(req.params.class_id, function (err, gClass) {
				if (err)
					res.send(err);

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
						students: gClass.users
					})
				}
			})
		})
}