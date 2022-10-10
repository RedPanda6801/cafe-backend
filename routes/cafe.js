const express = require("express");
const { addCafe, checkCafeName } = require("../controllers/cafe");
const { verifyToken } = require("../middlewares/middleware");

const router = express.Router();

// 카페 추가 API
router.post("/add-cafe", verifyToken, addCafe);
// 카페 이름 중복 체크 API
router.get("/check-cafe/:cafeName", verifyToken, checkCafeName);

module.exports = router;
