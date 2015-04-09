var User = require('./user'),
	Assignment = require('./assignment'),
	File = require('./file')
	mongoose = require('mongoose'),
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
	status: String
})