const express = require("express");
const { getTablet, getPhone } = require("../controllers/main");
const router = express.Router();

router.get("/tablet", getTablet);

router.get("/phone", getPhone);
module.exports = router;
