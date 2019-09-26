const { Rider, Sacco, Sms } = require("../../models/user");
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require("../../config/auth");

module.exports = router => {
  router.get("/dashboard", ensureAuthenticated, (req, res) => {
    const user = req.user;
    Rider.find({ sacco: user._id })
      .exec()
      .then(rider => {
        const response = {
          products: rider.map(doc => {
            const arr = [];
            if (doc.status === "Active") {
              arr.push(1);
            }
            return arr;
          })
        };
        res.render("saccodashboard", {
          user: req.user,
          rider: rider,
          doc: response.products.join("")
        });
      });
  });

  router.get("/register", ensureAuthenticated, (req, res) =>
    res.render("saccoregister", {
      user: req.user
    })
  );

  router.get("/logs", ensureAuthenticated, (req, res) => {
    const user = req.user;
    Sms.find({ Sacco: user.sacco }).then(log => {
      res.status(200);
      res.render("saccologs", {
        user: user,
        log: log
      });
    });
  });

  router.get("/logs/:riderId", ensureAuthenticated, (req, res) => {
    Rider.findById(req.params.riderId).then(rider => {
      Sms.find({ txt: rider.numberPlate })
        .then(log => {
          res.status(200);
          res.render("riderlog", {
            user: rider,
            log: log
          });
          res.status(200);
        })
        .catch(err => {
          if (err.kind === "ObjectId") {
            return res.status(404).send({
              message: "Sacco not found with id " + req.params.riderId
            });
          }
          return res.status(500).send({
            message: "Error retrieving Sacco with id " + req.params.riderId
          });
        });
    });
  });

  router.get("/contact", ensureAuthenticated, (req, res) => {
    res.render("contact", {
      user: req.user
    });
  });

  router.get("/profile/:riderId", ensureAuthenticated, (req, res) => {
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
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "Sacco not found with id " + req.params.riderId
          });
        }
        return res.status(500).send({
          message: "Error retrieving Sacco with id " + req.params.riderId
        });
      });
  });
};
