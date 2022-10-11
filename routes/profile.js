const express = require("express");
const { isNotLoggedIn, verifyToken } = require("../middlewares/middleware");
const {
  Ownerinfo,
  updateOwner,
  withdrawOwner,
} = require("../controllers/profile");

const router = express.Router();

//점주 정보 조회
router.get("/info", verifyToken, Ownerinfo);
//점주 정보 수정
router.put("/update-profile", verifyToken, updateOwner);
//점주 정보 삭제
router.delete("/remove-profile/:email/:password", verifyToken, withdrawOwner);

module.exports = router;
