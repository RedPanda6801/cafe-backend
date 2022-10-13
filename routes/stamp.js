const express = require("express");
const { verifyToken, checkCustomer } = require("../middlewares/middleware");
const { addstamp, searchstamp, removestamp } = require("../controllers/stamp");

const router = express.Router();

// 쿠폰 추가
// router.put("/update-cafe", verifyToken, addstamp);
// 쿠폰 조회
router.get(
  "/search/:custPhone/:cafeId",
  verifyToken,
  checkCustomer,
  searchstamp
);
// 쿠폰 count 차감
// router.delete("/update-cafe/:cafeName", verifyToken, removestamp);

module.exports = router;
