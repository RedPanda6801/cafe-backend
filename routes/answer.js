const express = require("express");
const { verifyToken, checkManager } = require("../middlewares/middleware");

const {
  addanswer,
  answerinfo,
  updateanswer,
  removeanswer,
} = require("../controllers/answer");

const router = express.Router();

// 답변 추가
router.post("/add-solution/:questionId", verifyToken, checkManager, addanswer);
// 답변 조회
router.get("/info", verifyToken, checkManager, answerinfo);
// 답변 수정
router.put(
  "/update-solution/:solutionId",
  verifyToken,
  checkManager,
  updateanswer
);
// 답변 삭제
router.delete(
  "/delete-solution/:solutionId",
  verifyToken,
  checkManager,
  removeanswer
);

module.exports = router;
