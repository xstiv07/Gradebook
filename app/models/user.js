var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	deepPopulate = require('mongoose-deep-populate'),
	bcrypt = require('bcrypt-nodejs'),
	Submission = require('./submission'),
	Class = require('./class');

//user schema

var UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	roles: [String],
	classes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Class'
	}],
	date: { 
		type: Date, 
		default: Date.now 
	}
});

//hash the password before the user is saved
UserSchema.pre('save', function (next) {
	var user = this;

	//hash the password only if the password has been changed or user is new
	if(!user.isModified('password'))
		return next();

	//generate the hash
	bcrypt.hash(user.password, null, null, function (err, hash) {
		if(err)
			return next(err)

		//change the password to the hashed version
		user.password = hash;
		next();
	});
});

//will remove user from classes on user delete
UserSchema.pre('remove', function (next) {
	var user = this;

	user.model('Class').update(
		{_id: {$in: user.classes}},
		{$pull: {users: user._id}},
		{multi: true},
		next
	);
});

//method to compare a given password with the database hash

UserSchema.methods.comparePassword = function (password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
}

UserSchema.plugin(deepPopulate);

module.exports = mongoose.model('User', UserSchema);