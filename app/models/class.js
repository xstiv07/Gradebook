var User = require('./user'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var classSchema = new Schema({
	crn: {
		type: Number,
		required: "CRN Required"
	},
	name: {
		type: String,
		required: "Class Name Required"
	},
	description: {
		type: String,
		required: 'Description Required'
	},
	users : [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
});

module.exports = mongoose.model('Class', classSchema);