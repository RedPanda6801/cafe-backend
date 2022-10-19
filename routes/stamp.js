const express = require("express");
const { verifyToken } = require("../middlewares/middleware");
const {
  addstamp,
  searchStamp,
  useStamp,
  updatememo,
  searchallstamp,
} = require("../controllers/stamp");

const router = express.Router();
// 고객 전체 조회
router.get("/search-all/:cafeId", verifyToken, searchallstamp);

// 쿠폰 조회
router.get(
  "/search/:custPhone/:cafeId",
  verifyToken,
  searchStamp // 쿠폰 초기화
);

// 쿠폰 추가
router.put("/add-stamp/:custPhone/:cafeId", verifyToken, addstamp);

// 쿠폰 사용
router.put("/use-stamp/:custPhone/:cafeId", verifyToken, useStamp);

// 쿠폰 고객 메모 추가 및 수정
router.put("/update-memo/:custPhone/:cafeId", verifyToken, updatememo);
module.exports = router;
