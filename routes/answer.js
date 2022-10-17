const express = require("express");
const { verifyToken } = require("../middlewares/middleware");

const {
  addanswer,
  answerinfo,
  updateanswer,
  removeanswer,
} = require("../controllers/answer");

const router = express.Router();

// 질문 추가
router.post("/add-answer", verifyToken, addanswer);
// 질문 조회
router.get("/info", verifyToken, answerinfo);
// 질문 수정
router.put("/update-answer/:answerId", verifyToken, updateanswer);
// 질문 삭제
router.delete("/remove-answer/:answerId", verifyToken, removeanswer);

module.exports = router;
