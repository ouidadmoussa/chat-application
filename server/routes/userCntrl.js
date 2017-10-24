/**
 * Created by root on 31/10/16.
 */

var User = require('../models/user');
var express = require('express');

var userRouter = express.Router();






//------->
module.exports = function(passport) {

  userRouter.post('/signup', passport.authenticate('local-signup', {failureRedirect : '/fail'}),
    function(req,res){
      for(var i in req.session.cookie)
      console.log("requested session.cookie : " + i + " : " +req.session.cookie[i])

      for(var i in req.session.passport)
        console.log("requested session.passport : " + i + " : " +req.session.passport[i])

      res.status(200).send({ success:true});});


    userRouter.post('/login',passport.authenticate('local-login',{ failureRedirect: '/login' }),
    function(req, res) {
      console.log("I am here " + req.session)
      res.status(200).send({ success:true});
    });


   userRouter.get('/listUsers', function(req,res){

     User.find({}, function (err, docs) {

       if(err)      return res.json({success: false, msg: err});
         res.json({listUsers: docs});

       })

  });





    return userRouter;
};

module.exports.addSocketId =function (socketId,userId){
  console.log("userCntrl.addSocket" + socketId + ":::  "+ userId)

  User.update({ _id: userId }, { $set: { socketId: socketId }}, function (err, docs) {
    if(err)      return res.json({success: false, msg: err});

  })

};
