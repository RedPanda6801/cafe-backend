const express = require("express");
const { verifyToken } = require("../middlewares/middleware");
const { infoCustomer } = require("../controllers/customer");

const router = express.Router();

//고객 정보 조회 (쿠폰 정보 조회)
router.get("/info/:cafeId", verifyToken, infoCustomer);

module.exports = router;
