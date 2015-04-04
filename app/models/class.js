var User = require('./user'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var classSchema = new Schema({
	crn: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	users : [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
});

module.exports = mongoose.model('Class', classSchema);