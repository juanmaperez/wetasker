var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const session = require("express-session");

const bcrypt = require("bcrypt");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const flash = require("connect-flash");


var app = express();

mongoose.connect('mongodb://localhost:27017/wetasker');

// Models

const User = require('./models/user');



// ROutes

var authRoutes = require('./routes/authRoutes');
var dashRoutes = require('./routes/dashRoutes');
var projectRoutes = require('./routes/projectRoutes');
var taskRoutes = require('./routes/taskRoutes');

var users = require('./routes/users');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main-layout');
app.use(expressLayouts);


app.use(flash());


app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, "bower_components")));

app.use('/', authRoutes);
app.use('/dashboard', dashRoutes);
app.use('/dashboard/projects', projectRoutes);
app.use('/dashboard/tasks', taskRoutes);

app.use('/users', users);



passport.serializeUser((user, cb) => {
  //console.log('serializer user: ', user );
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  //console.log('deserializer user: ', user );
  
  User.findOne({ "_id": user._id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


passport.use(new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, next) => {
  //console.log('LocalStrategy -> ', username, password );
  
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;