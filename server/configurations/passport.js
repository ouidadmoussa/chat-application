

var LocalStrategy   = require('passport-local').Strategy;

var User       		= require('../models/user');


module.exports = function(passport) {


  passport.serializeUser(function(user, done) {
    console.log(user)
    console.log("serialization")
    done(null, user._id);
  });


  passport.deserializeUser(function(id, done) {
    console.log("deserialize")
    User.findOne({_id: id}, function(err, user) {
      done(err, user);
    });
  });


  passport.use('local-signup', new LocalStrategy({

      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req,email,password, done) {
      console.log("local-signp proccess")

      User.findOne({ 'email' :  req.body.email }, function(err, user) {

        if (err)
          return done(err);

        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          console.log("create new user ")
          var newUser = new User();

          newUser.email    = req.body.email;
          newUser.password = newUser.generateHash(req.body.password);
          newUser.fullName=req.body.fullName;

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }

      });

    }));






  passport.use('local-login', new LocalStrategy({

      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req,email,password,  done) {

      User.findOne({ email :  email }, function(err, user) {

        if (err)  { return done(err); }

        if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));

        else {
          user.comparePassword(password,function(err, isMatch){

          if (isMatch && !err) {
            console.log("login done ")
            return done(null, user);
          }
          else{
          console.log("wrong password")
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        }

      });

        }});

    })
    );

  passport.authenticationMiddleware =function authenticationMiddleware () {
    return function (req, res, next) {
      if (req.isAuthenticated()) {
        return next()
      }
      res.send(200)
    }
  }

};
