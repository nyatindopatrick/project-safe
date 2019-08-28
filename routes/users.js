const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const { User, Sacco } = require('../models/user');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

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


// Register
router.post('/admin', (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });

      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );

                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  
});




router.post("/saccoadmin", (req, res) => {
  const {
    name,
    uniqueSaccoCode,
    address,
    postal_code,
    registration_number,
    telephone_number,
    membership,
    date_founded,
    description,
    website,
    created,
    saccoLeaderFname,
    saccoLeaderLname,
    saccoLeaderPhoneNumber,
    status,
    email,
    password,
    password2
  } = req.body;
  console.log(req.body);
  let errors = [];
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      uniqueSaccoCode,
      address,
      postal_code,
      registration_number,
      telephone_number,
      membership,
      date_founded,
      description,
      website,
      created,
      saccoLeaderFname,
      saccoLeaderLname,
      saccoLeaderPhoneNumber,
      status
    });
  } else {
    Sacco.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'The Sacco already exists' });
        res.render('register', {
          errors,
          name,
          uniqueSaccoCode,
          address,
          postal_code,
          registration_number,
          telephone_number,
          membership,
          date_founded,
          description,
          website,
          created,
          saccoLeaderFname,
          saccoLeaderLname,
          saccoLeaderPhoneNumber,
          status,
          email,
          password,
          password2
        });
      } else {
        const newUser = new Sacco({
          name,
          uniqueSaccoCode,
          address,
          postal_code,
          registration_number,
          telephone_number,
          membership,
          date_founded,
          description,
          website,
          created,
          saccoLeaderFname,
          saccoLeaderLname,
          saccoLeaderPhoneNumber,
          status,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                console.log(user.password);
                res.status(200);
                res.redirect('/dashboard');
              })
              .catch(err => console.log(err));
          });
        });
     }
    });
 }
});

router.put('/saccoadmin/:saccoId', (req, res) => {

  Sacco.findByIdAndUpdate(req.params.saccoId, {
    name: req.body.name,
    uniqueSaccoCode: req.body.uniqueSaccoCode,
    address: req.body.address,
    postal_code: req.body.postal_code,
    registration_number: req.body.registration_number,
    telephone_number: req.body.telephone_number,
    membership: req.body.membership,
    date_founded: req.body.date_founded,
    description: req.body.description,
    website: req.body.website,
    created: req.body.created,
    saccoLeaderFname: req.body.saccoLeaderFname,
    saccoLeaderLname: req.body.saccoLeaderLname,
    saccoLeaderPhoneNumber: req.body.saccoLeaderPhoneNumber,
    status: req.body.status,
    email: req.body.email
  }, { new: true })
    .then(note => {
      if (!note) {
        return res.status(404).send({
          message: "Note not found with id " + req.params.saccoId
        });
      }
      res.send(note);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Note not found with id " + req.params.saccoId
        });
      }
      return res.status(500).send({
        message: "Error updating note with id " + req.params.saccoId
      });
    })
});





// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
