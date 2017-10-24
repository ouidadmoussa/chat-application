const path = require('path');
const userCntrl = require('./userCntrl');
const inboxCntrl=require('./inboxCntrl')
User = require('../models/user');
Message = require('../models/message')
Conversation= require('../models/conversation');
const cookieParser = require('socket.io-cookie-parser');


module.exports = function (io,mongooseSessionStore) {
       console.log("hellloooooo")

  io.use(cookieParser('Play with Socket'))


  io.on('connection', function (socket) {

    mongooseSessionStore.get(socket.request.signedCookies['connect.sid'], function (err, session) {
      console.log("session : "+ session.passport.user)
      socket.userId = session.passport.user;
      userCntrl.addSocketId(socket.id, session.passport.user)
    })

console.log("on connection")

    socket.on('getAllConversations', function () {
      console.log("lets get conversations")
      User.findOne({_id: socket.userId})
        .exec(function (err, user) {

      inboxCntrl.getConversations(user._id,function( error , response) {

        io.to(user.socketId).emit("getAllConversationRes", response)
      })
    })
    })

    socket.on('add-message', function (data) {



      Conversation.findOne({_id: data.conversationId})
        .populate({
          path: 'participants',
          select: 'socketId',
          match: {_id: {$ne: socket.userId}},
          limit:1
        })
        .exec(function (err, conversation) {


          if (err) {
            res.send({error: err});
            return next(err);
          }

          inboxCntrl.sendReply(data,socket.userId ,function( error , response){
            console.log("zaaa3t :" +response)
            if (conversation.participants[0].socketId != "")
              io.to(conversation.participants[0].socketId).emit("add-message-response", response)

          });

        })


    })

    socket.on('new-conversation', function (data) {


      User.findOne({_id: data.recepientId})
        .exec(function (err, user) {

          inboxCntrl.newConversation(data,socket.userId ,function( error , response){

            response.conversation.participants=[]
            response.conversation.participants.push(user)



            io.to(user.socketId).emit("new-conversation-response", {'result':response,'isOwner':false})
            io.to(socket.id).emit("new-conversation-response", {'result':response,'isOwner':true})
          });
        });

        })






    /*
     // On conversation entry, join broadcast channel
     socket.on('enter conversation', function (conversation) {
     socket.join(conversation);
     // console.log('joined ' + conversation);
     });

     socket.on('leave conversation', function (conversation) {
     socket.leave(conversation);
     // console.log('left ' + conversation);
     });

     socket.on('new message', function (conversation) {
     io.sockets.in(conversation).emit('refresh messages', conversation);
     });

     socket.on('disconnect', function () {
     //console.log('user disconnected');
     });

     socket.on('chat message', function (msg) {
     io.emit('chat message', msg);
     });
     });
     */
  });

};
