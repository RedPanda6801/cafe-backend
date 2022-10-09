const express = require("express");
const { emailsender, emailauth } = require("../controllers/mail");

const router = express.Router();

// 인증을 위한 이메일 발송
router.get("/send-email/:email", emailsender);
// 인증 코드에 대한 처리
router.post("/process-code", emailauth);

module.exports = router;
