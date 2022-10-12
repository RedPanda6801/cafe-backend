const express = require("express");
const { verifyToken } = require("../middlewares/middleware");
const { addstamp, inquirestamp, removestamp } = require("../controllers/stamp");

const router = express.Router();

// 쿠폰 count 추가
router.put("/update-cafe", verifyToken, addstamp);
// 쿠폰 조회
router.get("/inquire", verifyToken, inquirestamp);
// 쿠폰 count 차감
// router.delete("/update-cafe/:cafeName", verifyToken, removestamp);

module.exports = router;
