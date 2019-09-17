const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const { Rider, Sacco } = require('../models/user');
// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('login'));


//date created
function creatd(d) {
  return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}
router.get('/logs', ensureAuthenticated, (req, res) =>
  res.render('logs', {
    user: req.user
  }));
// Register Page
router.get('/register', ensureAuthenticated, (req, res) => res.render('register', {
  user: req.user,
  creatd: creatd(new Date)
}));
//Admin profile page
router.get('/myprofile', ensureAuthenticated, (req, res) =>
  res.render('adminprofile', {
    user: req.user
  })
)
//single Sacco profile page
router.get('/profile/:riderId', ensureAuthenticated, (req, res) => {
  Rider.findById(req.params.riderId)
    .then(rider => {
      if (!rider) {
        return res.status(404).send({
          message: "Sacco not found with id " + req.params.riderId
        });
      }
      res.status(200);
      res.render("riderprofile", {
        rider: rider,
        user: req.user
      });
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Sacco not found with id " + req.params.riderId
        });
      }
      return res.status(500).send({
        message: "Error retrieving Sacco with id " + req.params.riderId
      });
    });
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  Rider.find()
    .exec()
    .then(rider => {
      const response = {
        products: rider.map(doc => {
          const arr = [];
          if (doc.status==="Active"){
            arr.push(1)
          }
          return arr
        })
      };
      res.render('dashboard', {
        user: req.user,
        rider: rider,
        doc: response.products.join('')
      })
    })
    });


module.exports = router;
