const express = require("express");
const { verifyToken } = require("../middlewares/middleware");

const {
  addquestion,
  questioninfo,
  updatequestion,
  removequestion,
} = require("../controllers/question");

const router = express.Router();

// 질문 추가
router.post("/add-question", verifyToken, addquestion);
// 질문 조회
router.get("/info", verifyToken, questioninfo);
// 질문 수정
router.put("/update-question/:questionId", verifyToken, updatequestion);
// 질문 삭제
router.delete("/delete-question/:questionId", verifyToken, removequestion);

module.exports = router;
