const passport = require("passport");
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require("../../config/auth");
const { Rider, Sacco, Sms } = require("../../models/user");

//generate random Sacco code
module.exports = router => {
  router.get("/logs", ensureAuthenticated, (req, res) => {
    Sms.find()
      .exec()
      .then(log => {
        res.status(200);
        res.render("logs", {
          user: req.user,
          log: log
        });
      });
  });

  router.get("/logs/:saccoId", ensureAuthenticated, (req, res) => {
    Rider.findById(req.params.saccoId).then(rider => {
      Sms.findById({ sacco: rider.sacco })
        .exec()
        .then(log => {
          res.status(200);
          res.render("logs", {
            user: req.user,
            log: log
          });
        });
    });
  });

  //single Sacco profile page
  router.get("/profile/:saccoId", ensureAuthenticated, (req, res) => {
    Sacco.findById(req.params.saccoId)
      .then(sacco => {
        if (!sacco) {
          return res.status(404).send({
            message: "Sacco not found with id " + req.params.saccoId
          });
        }
        res.status(200);
        res.render("saccoprofile", {
          sacco: sacco,
          user: req.user
        });
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Sacco not found with id " + req.params.saccoId
          });
        }
        return res.status(500).send({
          message: "Error retrieving Sacco with id " + req.params.saccoId
        });
      });
  });

  // Dashboard
  router.get("/dashboard", ensureAuthenticated, (req, res) => {
    Sacco.find()
      .exec()
      .then(sacco => {
        const response = {
          products: sacco.map(doc => {
            const arr = [];
            if (doc.status === "Active") {
              arr.push(1);
            }
            return arr;
          })
        };
        Rider.find().then(rider =>
          res.render("dashboard", {
            user: req.user,
            sacco: sacco,
            doc: response.products.join(""),
            rider: rider
          })
        );
      });
  });
};
