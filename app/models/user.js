/**
 * User.js
 */

// Setup ==============
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs');

// Schema =============
var UserSchema = new Schema({
    email: {
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
    }
});

// Password =============
// hash the password before saving it
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash if the password is new or modified
    if (!user.isModified('password')) return next();

    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        // save the hash
        user.password = hash;

        next();
    });
});

// compare the password to it's hash in the database
UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

// Finalize =============
module.exports = mongoose.model('User', UserSchema);
