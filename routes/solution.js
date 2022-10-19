const express = require("express");
const { verifyToken, checkManager } = require("../middlewares/middleware");

const {
  addsolution,
  infosolution,
  updatesolution,
  removesolution,
} = require("../controllers/solution");

const router = express.Router();

// 답변 조회
router.get("/info", verifyToken, checkManager, infosolution);
// 답변 추가
router.post(
  "/add-solution/:questionId",
  verifyToken,
  checkManager,
  addsolution
);
// 답변 수정
router.put(
  "/update-solution/:solutionId",
  verifyToken,
  checkManager,
  updatesolution
);
// 답변 삭제
router.delete(
  "/delete-solution/:solutionId",
  verifyToken,
  checkManager,
  removesolution
);

module.exports = router;
