"use strict";
const Conversation = require('../models/conversation'),
  Message = require('../models/message'),
  User = require('../models/user');


var express = require('express');

var inboxRouter = express.Router();




  inboxRouter.get('/getConversation/:conversationId',isLoggedIn, function (req, res, next) {
    Message.find({conversationId: req.params.conversationId})
      .select('createdAt body author')
      .sort('createdAt')
      .populate({
        path: 'author',
        select: 'fullName'
      })
      .exec(function (err, messages) {
        if (err) {
          res.send({error: err});
          return next(err);
        }

        res.status(200).json({convMessages: messages});
      });
  });



  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {


      return next();
    }
    else
      console.log("not connected ")

  }

module.exports = inboxRouter;


module.exports.getConversations= function (currentUser,callback) {

console.log("get conversations : " + currentUser)
  Conversation.find({participants: currentUser})
    .populate({
      path: 'participants',
      select: 'fullName',
      match: { _id: { $ne: currentUser }},
    })
    .exec(function (err, conversations) {
      if (err) {
        res.send({error: err});
        return next(err);
      }


      var fullConversations = [];
      conversations.forEach(function (conversation) {
        Message.findOne({'conversationId': conversation._id})
          .select('body')
          .sort('-createdAt')
          .exec(function (err, message) {
            if (err) {
              res.send({error: err});
              return next(err);
            }

            fullConversations.push({'conversation': conversation, 'lastMsg': message.body});
            if (fullConversations.length === conversations.length) {
             var  data={'conversations': fullConversations}
              callback(err, data);
            }
          });
      });
    });
}


module.exports.newConversation =function (data,userId,callback) {


  if (!data.recepientId) {
    res.status(422).send({error: 'Please choose a valid recipient for your message.'});
    console.log('Please choose a valid recipient for your message.')
    return next();
  }

  if (!data.composedMsg) {
    console.log('Please enter a message.')

    res.status(422).send({error: 'Please enter a message.'});
    return next();
  }

  const conversation = new Conversation({
    participants: [userId, data.recepientId]
  });

   conversation.save(function (err, newConversation) {
    if (err) {
      console.log(err)
      callback("error", err);

    }

    const message = new Message({
      conversationId: newConversation._id,
      body: data.composedMsg,
      author: userId
    });

    message.save(function (err, newMessage) {
      if (err) {

        callback("error", err);

      }
      var data={'conversation': newConversation, 'lastMsg': newMessage.body}
      callback(err, data);
    });


  });

}

module.exports.sendReply= function (data,userId,callback) {

  const reply = new Message({
    conversationId: data.conversationId,
    body: data.message,
    author: userId
  });


  reply.save(function (err, sentReply) {
    if (err) {
      res.send({error: err});
      callback(err, sentReply);
    }

    callback(err, sentReply);
  });
}
