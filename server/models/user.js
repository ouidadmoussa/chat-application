/**
 * Created by root on 28/10/16.
 */

'use strict';

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var userSchema = new Schema({
     socketId: String,
     fullName    : String,
     email: {
        type: String,
        unique: true,
    },
    password: String,



}, { collection: 'user' });


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


userSchema.methods.comparePassword = function(pw,cb) {
    bcrypt.compare(pw, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', userSchema);
