var User = require('./user'),
	Assignment = require('./assignment'),
	mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
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
	term: {
		type: String,
		required: true
	},
	instructor: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
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

classSchema.pre('remove', function (next) {
	var gClass = this;

	//should update all references of users
	gClass.model('User').update(
		{_id: {$in: gClass.users}},
		{$pull: {classes: gClass._id}},
		{multi: true},
		next
	);

	//should remove all assignments of a class when it is deleted
	gClass.model('Assignment').remove({_id: {$in: gClass.assignments}}).exec();
	next();
});

classSchema.plugin(deepPopulate);

module.exports = mongoose.model('Class', classSchema);