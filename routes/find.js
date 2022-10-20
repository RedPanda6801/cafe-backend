const express = require("express");
const { sendUserId, findPassword } = require("../controllers/find");

const router = express.Router();

// 이메일로 아이디 찾기 API
router.get("/userId/:email/:name", sendUserId);
// 이메일, 본명, 아이디로 비밀번호 찾기 API
router.post("/password", findPassword);

module.exports = router;
