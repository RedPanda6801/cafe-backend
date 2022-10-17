const express = require("express");
const {
  signup,
  signin,
  checkEmail,
  checkUserId,
} = require("../controllers/auth");

const router = express.Router();

// 회원가입 기능
router.post("/join", signup);
// 로그인 기능
router.post("/login", signin);
// 이메일에 대한 중복 체크
router.get("/check-email/:email", checkEmail);
// 아이디에 대한 중복 체크
router.get("/check-id/:userId", checkUserId);
// 비밀번호 찾기
// router.get("/find-pass", getPassword);
// 아이디 찾기
// router.get("/find-id", getId);

module.exports = router;
