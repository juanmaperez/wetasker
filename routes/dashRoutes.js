const express = require('express');
const dashRoutes = express.Router();


const User = require('../models/user')

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); 
    } else {
      res.redirect('/')
    }
}

dashRoutes.get('/', ensureAuthenticated, (req,res, next)=>{
    res.render('dashboard/index', {user: req.user});  
});


module.exports = dashRoutes;