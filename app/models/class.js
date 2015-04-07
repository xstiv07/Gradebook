var User = require('./user'),
	Assignment = require('./assignment'),
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
	}],
	assignments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Assignment'
	}]
});

classSchema.pre('remove', function () {
	var gClass = this;

	//remove all references of object
	assignment.model('Class').update(
		{_id: {$in: this.users}},
		{$pull: {classes: gClass._id}},
		{multi: true},
		next
	);
})

module.exports = mongoose.model('Class', classSchema);