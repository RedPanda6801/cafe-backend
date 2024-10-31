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

/* 개선점
1. 번호 삭제 시 '-' 삭제 안됨
2. 사용 가능 쿠폰 개수가 소수점으로 보여짐
3. 적립 페이지에서 적립하기 / 쿠폰 보기 페이지 필요
4. 사장님 페이지도 적립 시 알림이 뜨게
*/