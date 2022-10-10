const express = require("express");
const { isNotLoggedIn } = require("../middlewares/middleware");
const {
  Ownerinfo,
  // signin,
  // checkEmail,
  // checkUserId,
} = require("../controllers/auth");

//점주 정보 조회
router.get("/:email", isLoggedIn, Ownerinfo);
//점주 정보 수정
router.put("/edit-profile", isNotLoggedIn, signin);
//점주 정보 삭제
router.delete("/remove/:email", isNotLoggedIn);
