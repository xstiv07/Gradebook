var Assignment = require('../models/assignment'),
	Class = require('../models/class');

module.exports = function (apiRouter) {

	//assignments for a specific class
	apiRouter.route('/assignments/view/:class_id')
		.get(function (req, res) {
			Class.findOne({
					_id: req.params.class_id
				}).populate('assignments').exec(function (err, gClass) {
					if (err)
						return err;
					else{
						res.json({
							assignments: gClass.assignments
						});
					};
				});
			})
		//it is not an array that is why I cannot pull
		.put(function (req, res) {
			Assignment.update({
				_id: req.body.assignmentId},
				{$pull: {gclass: req.params.class_id}}, function (err) {
					if (err)
						res.send(err);
			});
			Class.update({
				_id: req.params.class_id},
				{$pull: {assignments: req.body.assignmentId}}, function (err) {
					if (err)
						res.send(err);
			});
			res.json({
				success: true
			});
		})

	apiRouter.post('/assignments/addExisting/:class_id', function (req, res) {
		Class.findById(req.params.class_id, function (err, gxClass) {
			if (err)
				res.send(err);

			console.log(req.body);

			for (var i in req.body) {
				Assignment.update({
					_id: req.body[i]},
					{$addToSet: {gclass: gxClass}}, function (err) {
						if(err)
							res.send(err);
				});

				Class.update({
					_id: gxClass._id},
					{$addToSet: {assignments: req.body[i]}}, function (err) {
						if (err)
							res.send(err);
				});
			};
			res.json({
				success: true
			});
		});
	});
		
	apiRouter.post('/assignments/create/:class_id', function (req, res) {
		var assignm = new Assignment();

		assignm.name = req.body.name;
		assignm.description = req.body.description;
		assignm.gclass = req.params.class_id;

		Class.findById(req.params.class_id, function (err, gClass) {

			if (err)
				res.send(err);
			else
				gClass.assignments.push(assignm);

			gClass.save(function (err) {
				if (err)
					res.send(err);
			});
		});

		assignm.save(function (err) {
			if (err)
				res.send(err);
			else
				res.json({success: true});
		});
	});

	apiRouter.delete('/assignments/:assignment_id', function (req, res) {

		Assignment.findByIdAndRemove(req.params.assignment_id, function (err, assignm) {
			if (err)
				res.send(err);
			assignm.remove();
		}).then(function () {
			Assignment.find(function (err, assignments) {
				res.json({
					assignments: assignments,
					success: true
				});
			});
		});
	});

		//create and list all assignments
	apiRouter.route('/assignments')
		.get(function (req, res) {
			Assignment.find(function (err, assignments) {
				if (err)
					res.send(err);
				else
					res.json(assignments);
			});
		});
}