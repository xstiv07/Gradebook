var Assignment = require('../models/assignment'),
	Class = require('../models/class');
	Submission = require('../models/submission'),
	File = require('../models/file');

module.exports = function (apiRouter) {

	//assignments for a specific class
	apiRouter.route('/assignments/view/:class_id')
		.get(function (req, res) {
			Class.findOne({
					_id: req.params.class_id
				}).populate('assignments').exec(function (err, gClass) {
					if (err)
						res.send(err);
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
		});

	apiRouter.post('/assignments/addExisting/:class_id', function (req, res) {
		Class.findById(req.params.class_id, function (err, gxClass) {
			if (err)
				res.send(err);

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

	apiRouter.route('/assignments/submit/:assignment_id')
		.post(function (req, res) {
			console.log(req.files)
			var submission = new Submission();
			submission.user = req.body.data; //userId
			submission.assignment = req.params.assignment_id;

			for (var file in req.files) {
				var submissionFile = new File();
				submissionFile.submission = submission._id;
				submissionFile.path = '/uploads/' + req.files[file].name;
				submissionFile.name = req.files[file].originalname;

				submission.files.push(submissionFile); // adding a file reference to a submission
				submissionFile.save(function (err) {
					if (err)
						res.send(err)
				});
			};
			Assignment.update({
				_id: req.params.assignment_id},
				{$push: {submissions: submission}}, function (err) {
					if (err)
						res.send(err)
			});

			submission.save(function (err) {
				if (err)
					res.send(err);
			})
			res.json({
				success: true
			});
		})
		.get(function (req, res) {
			//find an assignment, populate with submissions and files and return
			Assignment.findOne({
				_id: req.params.assignment_id
			}).populate('submissions').exec(function (err, assignm) {
				if (err)
					res.send(err);
				else{
					res.json({
						submissions: assignm.submissions,
						success: true
					});
				};
			});
		});

	apiRouter.get('/assignments/files/:submission_id', function (req, res) {
		Submission.findOne({
			_id: req.params.submission_id
		}).populate('files').exec(function (err, submission) {
			if (err)
				res.send(err);
			else{
				res.json({
					files: submission.files,
					success: true
				});
			};
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