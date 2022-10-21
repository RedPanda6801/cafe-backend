const express = require("express");
const { verifyToken } = require("../middlewares/middleware");
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
//점주 정보 삭제 (암호화 코드는 body로 보내야한다!!)
router.delete("/remove-profile/:email", verifyToken, withdrawOwner);

module.exports = router;
