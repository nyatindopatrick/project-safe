const router = require("express").Router();

require("./admin")(router);
require("./adminGet")(router);

module.exports = router;
