var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var app = express();
var session     =       require('express-session');
var MongoStore  =       require('connect-mongo')(session);
var server = require('http').Server(app);
var io = require('socket.io')(server);

var passport = require('passport');


var socketEvents = require('./server/routes/socketEvents');

mongoose.connect('mongodb://localhost/socket_chat');
require('./server/configurations/passport')(passport)

var userCntrl = require('./server/routes/userCntrl')(passport);
var inboxCntrl = require('./server/routes/inboxCntrl');

app.use(require('morgan')('dev'));

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));


var mongooseSessionStore =new MongoStore({ mongooseConnection: mongoose.connection })

app.use(session({ secret: 'Play with Socket', resave: false, saveUninitialized: false,
  store: mongooseSessionStore,
  cookie: {
    secure: false,
    maxAge: 864000000,

  }}));
app.use(passport.initialize());

app.use(passport.session());

/**/

app.use(express.static(path.join(__dirname, '/dist')));





app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


var flash = require('connect-flash');

app.use(flash());




app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});


/**
 * Routes
 */

app.use('/api/user', userCntrl);


app.use('/api/inbox', inboxCntrl);





app.get('/api', function(req, res)  {
  res.send('api works');
});


app.get('/getCurrentUser',function(req, res)  {
  if (req.isAuthenticated())
  res.status(200).send(req.user)
});


app.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});



app.all('*', function (req  ,res ) {
  res.status(200).sendFile(path.join(__dirname + '/dist/index.html'));
});



/**
 * sockets
 */
socketEvents(io,mongooseSessionStore)


/**
 *  error handlers
 */

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.type("text/html");
        res.send(err.message)

    });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.type("text/html");
    res.send(err.message)
});


/**
 *  events handlers
 */

process
  .on('uncaughtException', function(err){
  console.error(err, 'Uncaught Exception thrown');
  });






server.listen(3000);



module.exports = app;
