var Assignment = require('../models/assignment'),
	Class = require('../models/class'),
	User = require('../models/user'),
	Submission = require('../models/submission'),
	deepPopulate = require('mongoose-deep-populate'),
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
						console.log(gClass.name)
						res.json({
							assignments: gClass.assignments,
							classNm: gClass.name
						});
					};
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

	apiRouter.put('/assignments/edit/:assignment_id', function (req, res) {
		Assignment.findById(req.params.assignment_id, function (err, assignm) {
			if(err)
				res.send(err);

			if (req.body.name)
				assignm.name = req.body.name;
			if(req.body.description)
				assignm.description = req.body.description;
			if(req.body.dateAssigned)
				assignm.dateAssigned = req.body.dateAssigned;
			if(req.body.dateDue)
				assignm.dateDue = req.body.dateDue;

			assignm.save(function (err) {
				if (err)
					res.send(err);
				else
					res.json({
						success: true,
						message: 'Successfully updated'
					});
			});
		});
	});

	apiRouter.route('/assignments/submit/:assignment_id')
		.post(function (req, res) {
			var submission = new Submission();
			submission.user = req.body.data; //userId
			submission.assignment = req.params.assignment_id;

			if (req.files.file.length != undefined){
				for (var i = 0; i < req.files.file.length; i++) {
					var submissionFile = new File();
					submissionFile.submission = submission._id;
					submissionFile.path = '/uploads/' + req.files.file[i].name;
					submissionFile.name = req.files.file[i].originalname;

					submission.files.push(submissionFile); // adding a file reference to a submission
					submission.status = "Submitted";
					submissionFile.save();
				};
			}else{
				for(var file in req.files){
					var submissionFile = new File();
					submissionFile.submission = submission._id;
					submissionFile.path = '/uploads/' + req.files[file].name;
					submissionFile.name = req.files[file].originalname;

					submission.files.push(submissionFile); // adding a file reference to a submission
					submission.status = "Submitted";
					submissionFile.save();
				};
			};

			User.update({
				_id: req.body.data},
				{$push: {submissions: submission}}, function (err) {
					if(err)
						res.send(err);
			});

			Assignment.update({
				_id: req.params.assignment_id},
				{$push: {submissions: submission}}, function (err) {
					if (err)
						res.send(err)
			});

			submission.save(function (err) {
				console.log('saving')
				if (err)
					res.send(err);
				else
					res.json({success: true});
			});
		})
		.get(function (req, res) {
			//find an assignment, populate with submissions and files and return
			Assignment.findOne({
				_id: req.params.assignment_id
			}).deepPopulate('submissions.files submissions.user').exec(function (err, assignm) {
				if (err)
					res.send(err);
				else{
					res.json({
						submissions: assignm.submissions,
						assignmentName: assignm.name,
						success: true
					});
				};
			});
		});

		//will grade a submission based on the passed grade and submission id
	apiRouter.post('/assignment/setGradeOrComment', function (req, res) {
		var gradeToSet = req.body.gradeToSet;
		var commentToSet = req.body.commentToSet;
		var submissionId = req.body.submissionId;

		var data;

		if(commentToSet != null){
			data = {
				comment: commentToSet,
			};
		}else{
			data = {
				grade: gradeToSet,
				status: 'Graded'
			};
		};

		Submission.update({
			_id: submissionId}, data, function (err) {
				if (err)
					res.send(err)
				else
					res.json({
						success: true
					})
		})

	});
		
	apiRouter.post('/assignments/create/:class_id', function (req, res) {

		var assignm = new Assignment();

		console.log(req.body)

		assignm.name = req.body.name;
		assignm.description = req.body.description;
		assignm.dateDue = req.body.dateDue;
		assignm.gclass = req.params.class_id;
		if(assignm.dateAssigned != null || assignm.dateAssigned != '')
			assignm.dateAssigned = req.body.dateAssigned;

		Class.update({
			_id: req.params.class_id},
			{$push: {assignments: assignm}}, function (err) {
				if (err)
					res.send(err)
		});

		assignm.save(function (err) {
			if (err)
				res.send(err);
			else
				res.json({
					success: true,
					message: 'Successfully created'
				});
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
			Assignment.find().deepPopulate('gclass').exec(function (err, assignments) {
				if (err)
					res.send(err);
				else
					res.json(assignments);
			})
		});
}