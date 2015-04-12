var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	Submission = require('./submission'),
	deepPopulate = require('mongoose-deep-populate'),
	Class = require('./class');
	

var assignmentSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	gclass: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Class'
	}],
	submissions:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Submission'
	}]
});

assignmentSchema.pre('remove', function (next) {
	var assignment = this;

	//remove all references of object
	assignment.model('Class').update(
		{_id: this.gclass},
		{$pull: {assignments: assignment._id}},
		{multi: true},
		next
	);
});

assignmentSchema.plugin(deepPopulate);

module.exports = mongoose.model('Assignment', assignmentSchema);