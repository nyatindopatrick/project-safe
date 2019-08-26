const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { User, Sacco } = require('../models/User');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

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
