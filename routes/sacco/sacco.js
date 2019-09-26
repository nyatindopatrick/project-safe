// const express = require("express");
// const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");

require("dotenv").config();
// Load User model
const { Rider, Sacco, Sms } = require("../../models/user");
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require("../../config/auth");

module.exports = router => {
  router.get("/login", forwardAuthenticated, (req, res) =>
    res.render("saccologin")
  );

  //register new rider
  router.post("/register", (req, res) => {
    const {
      riderFname,
      riderSurName,
      riderLname,
      riderTelNumber,
      drivingLicense,
      DLIssueDate,
      DLExpDate,
      riderPassportPhoto,
      riderID,
      riderBase,
      riderResidence,
      bikeOwnerFname,
      bikeOwnerLname,
      bikeOwnerResidence,
      bikeOwnerID,
      bikeOwnerTelNumber,
      motorBikeMake,
      motorBikeBrand,
      insuranceNumber,
      insuranceIssueDate,
      insuranceExpDate,
      numberPlate,
      mysacco,
      sacco
    } = req.body;

    let errors = [];
    Rider.findOne({ riderID: riderID }).then(user => {
      if (user) {
        errors.push({ msg: "The rider already exists" });
        res.render("register", {
          errors,
          riderFname,
          riderSurName,
          riderLname,
          riderTelNumber,
          drivingLicense,
          DLIssueDate,
          DLExpDate,
          riderPassportPhoto,
          riderID,
          riderBase,
          riderResidence
        });
      } else {
        const newUser = new Rider({
          riderFname,
          riderSurName,
          riderLname,
          riderTelNumber,
          drivingLicense,
          DLIssueDate,
          DLExpDate,
          riderPassportPhoto,
          riderID,
          riderBase,
          riderResidence,
          bikeOwnerFname,
          bikeOwnerLname,
          bikeOwnerResidence,
          bikeOwnerID,
          bikeOwnerTelNumber,
          motorBikeMake,
          motorBikeBrand,
          insuranceNumber,
          insuranceIssueDate,
          insuranceExpDate,
          numberPlate,
          mysacco,
          sacco
        });
        // Set your app credentials
        const credentials = {
          apiKey: process.env.AT_KEY,
          username: "loopedin"
        };

        // Initialize the SDK
        const AfricasTalking = require("africastalking")(credentials);

        // Get the SMS service
        const sms = AfricasTalking.SMS;

        function sendMessage() {
          const options = {
            // Set the numbers you want to send to in international format
            to: "+254" + riderTelNumber,
            // Set your message
            message:
              `Hello ${riderFname} ${riderSurName}. You have been sucessfully registered with ${mysacco}.\n` +
              `Send the word 'Fikasafe ${numberPlate}' to '22384' to confirm your details. Thank you for staying safe.`,
            // Set your shortCode or senderId
            from: "LakeHub"
          };

          // That’s it, hit send and we’ll take care of the rest
          sms
            .send(options)
            .then(console.log)
            .catch(console.log);
        }

        sendMessage();
        newUser
          .save()
          .then(user => {
            console.log(user.password);
            res.status(200);
            res.redirect("/sacco/dashboard");
          })
          .catch(err => console.log(err));
      }
    });
  });

  //Update specific sacco details
  router.put("/:riderId", (req, res) => {
    Rider.findByIdAndUpdate(
      { _id: req.params.riderId },
      {
        riderFname: req.body.riderFname,
        riderSurName: req.body.riderSurName,
        riderLname: req.body.riderLname,
        riderTelNumber: req.body.riderTelNumber,
        drivingLicense: req.body.drivingLicense,
        DLIssueDate: req.body.DLIssueDate,
        DLExpDate: req.body.DLExpDate,
        riderPassportPhoto: req.body.DLExpDate,
        riderID: req.body.riderID,
        status: req.body.status,
        riderBase: req.body.riderBase,
        riderResidence: req.body.riderResidence,
        bikeOwnerFname: req.body.bikeOwnerFname,
        bikeOwnerLname: req.body.bikeOwnerLname,
        bikeOwnerResidence: req.body.bikeOwnerResidence,
        bikeOwnerID: req.body.bikeOwnerID,
        bikeOwnerTelNumber: req.body.bikeOwnerTelNumber,
        motorBikeMake: req.body.motorBikeMake,
        motorBikeBrand: req.body.motorBikeBrand,
        insuranceNumber: req.body.insuranceNumber,
        insuranceIssueDate: req.body.insuranceIssueDate,
        insuranceExpDate: req.body.insuranceExpDate
      },
      { new: true }
    )
      .then(sacco => {
        if (!sacco) {
          return res.status(404).send({
            message: "Rider not found with id " + req.params.riderId
          });
        }
        res.redirect("/sacco/dashboard");
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Rider not found with id " + req.params.riderId
          });
        }
        return res.status(500).send({
          message: "Error updating Rider with id " + req.params.riderId
        });
      });
  });
  router.put("/status/:riderId", (req, res) => {
    Sacco.findByIdAndUpdate(
      { _id: req.params.riderId },
      {
        status: req.body.status
      },
      { new: true }
    )
      .then(sacco => {
        if (!sacco) {
          return res.status(404).send({
            message: "Sacco not found with id " + req.params.riderId
          });
        }
        res.redirect("/sacco/dashboard");
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Sacco not found with id " + req.params.riderId
          });
        }
        return res.status(500).send({
          message: "Error updating Sacco with id " + req.params.riderId
        });
      });
  });

  // Login
  router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/sacco/dashboard",
      failureRedirect: "/sacco/login",
      failureFlash: true
    })(req, res, next);
  });

  // Logout
  router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
  });
};
// Login Page
