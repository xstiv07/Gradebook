var User = require('./user'),
	Assignment = require('./assignment'),
	File = require('./file'),
	mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
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


submissionSchema.plugin(deepPopulate);

module.exports = mongoose.model('Submission', submissionSchema);