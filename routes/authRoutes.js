var express = require('express');
var authRoutes = express.Router();
const passport = require('passport');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const User = require('../models/user');

function ensureNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      res.redirect('/dashboard')
  } else {
      return next(); 
  }
}

/* GET home page. */

authRoutes.get('/', ensureNotAuthenticated, function(req, res, next) {
  res.render('auth/login');
});

authRoutes.post('/', passport.authenticate('local',{
  successRedirect: "/dashboard",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}
))

authRoutes.get('/signup', ensureNotAuthenticated, function(req, res, next) {
  res.render('auth/signup');
});

authRoutes.post('/signup', (req, res, next)=>{
  if(req.body.username == "" || req.body.password == ""){
    res.render("/signup", {
      errorMessage: "All fields are mandatories"
    });
  }
  User.findOne({email: req.body.email}, (err, user)=>{
    "email",
    (err, user)=>{
      if(user !== null){
        res.render('/signup', {
          errorMessage: "This email already exists"
        })
      }
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username  : req.body.username,
      email     : req.body.email,
      password  : hashPass,
      credits   : 0,
    })

    console.log('new user', newUser)
    newUser.save((err)=>{
      if(err){
        res.render('/signup',{
          errorMessage : "Something went wrong"
        })
      }else{
        res.redirect('/dashboard')
      }
    })
  })
})


authRoutes.get('/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/');
})





module.exports = authRoutes;



