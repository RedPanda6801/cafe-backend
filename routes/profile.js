const express = require("express");
const { isNotLoggedIn } = require("../middlewares/middleware");
const {
  Ownerinfo,
  editOwner,
  withdrawOwner,
} = require("../controllers/profile");

//점주 정보 조회
router.get("/:email", isLoggedIn, Ownerinfo);
//점주 정보 수정
router.put("/edit-profile/:email", isLoggedIn, editOwner);
//점주 정보 삭제
router.delete("/remove-profile/:email", withdrawOwner);
