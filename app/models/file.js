var Submission = require('./submission'),
	mongoose = require('mongoose'),
	fs = require('fs'),
	Schema = mongoose.Schema;

var fileSchema = new Schema({
	submission: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Submission'
	},
	path: String,
	name: String
})

module.exports = mongoose.model('File', fileSchema);