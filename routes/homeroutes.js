const passport = require("passport");
const jwt = require("jsonwebtoken");
const auth = require("../config/auth");
const { Rider, Sacco, Sms } = require("../models/user");
// Welcome Page
module.exports = router => {
  router.get("/", (req, res) => res.render("homepage"));

  router.post("/search", (req, res) => {
    const plateNumber = req.body.plateNumber.toUpperCase();
    Rider.findOne({ numberPlate: plateNumber }).then(rider => {
      if (rider) {
        res.render("riderfind", {
          rider: rider
        });
      } else {
        res.render("ridernotfound", {
          plateNumber
        });
      }
    });
  });
};
