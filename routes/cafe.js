const express = require("express");
const {
  addCafe,
  checkCafe,
  cafeinfo,
  cafeoneinfo,
  updatecafe,
  removecafe,
} = require("../controllers/cafe");
const { verifyToken, upload } = require("../middlewares/middleware");

const router = express.Router();

// 카페 추가 API
router.post("/add-cafe", verifyToken, addCafe);
// 카페 이름 중복 체크 API
// router.get("/check-cafe/:cafeName", verifyToken, checkCafe);
// 내 카페 정보 조회
router.get("/info", verifyToken, cafeinfo);
// 내 카페 단일 정보 조회
router.get("/info-one/:cafeId", verifyToken, cafeoneinfo);
// 내 카페 정보 수정
router.put(
  "/update-cafe/:cafeId",
  verifyToken,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "img", maxCount: 1 },
  ]),
  updatecafe
);
// 내 카페 삭제
router.delete("/remove-cafe/:cafeId", verifyToken, removecafe);

module.exports = router;
