var User = require('./user'),
	Assignment = require('./assignment'),
	File = require('./file'),
	mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	fs = require('fs'),
	Schema = mongoose.Schema;

var submissionSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	assignment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Assignment'
	},
	files: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'File'
	}],
	grade: String,
	comment: String,
	date: { 
		type: Date, 
		default: Date.now 
	},
	status: String
})


//will remove an all files on submission remove
submissionSchema.pre('remove', function (next) {
	var submission = this;

	async.each(submission.files, function (fileId, next) {
		submission.model('File').findByIdAndRemove(fileId).exec(function (err, file) {

			//removes file from a file system
			fs.unlink("public" + file.path, function (err) {
				if (err)
					throw err;
			})

			file.remove();
			next();
		})
	});
});

submissionSchema.plugin(deepPopulate);

module.exports = mongoose.model('Submission', submissionSchema);