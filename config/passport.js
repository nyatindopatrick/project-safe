const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const {User, Sacco} = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      if (email==="nyatindopatrick@gmail.com"){
        User.findOne({
          email: email
        }).then(user => {
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        });
      }
      else {
        Sacco.findOne({
          email: email
        }).then(sacco => {
          if (!sacco) {
            return done(null, false, { message: 'That email is not registered' });
          }
  
          // Match password
          bcrypt.compare(password, sacco.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, sacco);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
        });
      }

    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
