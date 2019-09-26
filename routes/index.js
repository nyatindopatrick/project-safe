const router = require("express").Router();

require("./homeroutes")(router);
require("./sms")(router);
require("./contact")(router);

module.exports = router;
