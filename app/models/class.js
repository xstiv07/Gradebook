var User = require('./user'),
	Assignment = require('./assignment'),
	mongoose = require('mongoose'),
	deepPopulate = require('mongoose-deep-populate'),
	async = require('async'),
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

	console.log('triggered from class schema')

	async.each(gClass.assignments, function (assignmId, next) {
		gClass.model('Assignment').findByIdAndRemove(assignmId).exec(function (err, assignm) {

			assignm.remove();
			next();
		})
	});

	//should update all references of users
	gClass.model('User').update(
		{_id: {$in: gClass.users}},
		{$pull: {classes: gClass._id}},
		{multi: true},
		next
	);
})


classSchema.plugin(deepPopulate);

module.exports = mongoose.model('Class', classSchema);