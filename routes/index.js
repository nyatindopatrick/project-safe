const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { User, Sacco } = require('../models/user');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

//generate random Sacco code
const d = new Date;
function saccoCode(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result + d.getFullYear();
}

//date created
function creatd(d) {
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

// Register Page
router.get('/register', ensureAuthenticated, (req, res) => res.render('register', {
  user: req.user,
  saccoCode: saccoCode(8),
  creatd: creatd(new Date)
}));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Sacco.find()
  .exec()
  .then(sacco => {
    res.render('dashboard', {
      user: req.user,
      sacco: sacco
    })
  });

});

module.exports = router;
