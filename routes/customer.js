const express = require("express");
const { verifyToken } = require("../middlewares/middleware");
// const { customerinfo } = require("../controllers/customer");

const router = express.Router();

//고객 정보 조회
// router.get("/info", verifyToken, customerinfo);

module.exports = router;
