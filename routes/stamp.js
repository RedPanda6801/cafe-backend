const express = require("express");
const { verifyToken, checkCustomer } = require("../middlewares/middleware");
const { addstamp, checkStamp, useStamp } = require("../controllers/stamp");

const router = express.Router();

// 쿠폰 조회
router.get(
  "/search/:custPhone/:cafeId",
  verifyToken,
  checkCustomer, // 고객 초기화
  checkStamp // 쿠폰 초기화
);

// 쿠폰 추가
router.put(
  "/add-stamp/:custPhone/:cafeId",
  verifyToken,
  checkCustomer,
  addstamp
);

// 쿠폰 사용
router.put(
  "/use-stamp/:custPhone/:cafeId",
  verifyToken,
  checkCustomer,
  useStamp
);

module.exports = router;
