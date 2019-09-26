const router = require("express").Router();

require("./sacco")(router);
require("./saccoGet")(router);

module.exports = router;
