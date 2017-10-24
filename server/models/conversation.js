/**
 * Created by root on 17/11/16.
 */
var User = require('../models/user');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var ConversationSchema = new Schema({

    participants: [{ type: Schema.Types.ObjectId, ref: 'User'}],
}, { collection: 'conversation' });

module.exports = mongoose.model('Conversation', ConversationSchema);