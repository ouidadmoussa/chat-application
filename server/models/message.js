/**
 * Created by root on 17/11/16.
 */

var User = require('../models/user');
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const MessageSchema = new Schema({
        conversationId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    }, { collection: 'message' });

module.exports = mongoose.model('Message', MessageSchema);