const { getAuthCode, makeEmail } = require("../libs/util");
const { Owner } = require("../models");
const resCode = require("../libs/error");
const bcrypt = require("bcrypt");

exports.emailsender = async (req, res, next) => {
  try {
    const { email } = req.params;
    const owner = await Owner.findOne({ where: { email } });
    // 유저 메일 중복 예외 처리
    if (owner) {
      const error = resCode.BAD_REQUEST_EXIESTED;
      return res.status(error.code).json(error);
    }
    const code = getAuthCode();
    if (code && email) {
      const html = `<h1>이메일 인증 코드입니다.</h1>
      <h2>${code}</h2>
      <h3>코드를 입력해주세요!</h3>
      `;
      const subject = "이메일 인증 요청 - 마이스탬프";
      // email과 code가 유효하면 메일을 보냄
      const emailMaker = makeEmail(html, subject, email);

      // LocalStorage에 저장하되, 암호화하여 저장 -> 코드 인증 시에 복호화하여 비교
      const hashCode = await bcrypt.hash(code, 12);
      console.log(hashCode);
      const info = await emailMaker[0].sendMail(emailMaker[1]);
      console.log("메일 정보: ", info);
      const response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
      response.user = {
        hash: hashCode,
        email,
      };
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};
exports.emailauth = async (req, res, next) => {
  try {
    const { email, code, hash } = req.body;
    // 복호화 해줌
    const result = await bcrypt.compare(code, hash);
    console.log(result);
    if (result) {
      const response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
      response.email = email;
      return res.status(response.code).json(response);
    } else {
      const error = JSON.parse(JSON.stringify(resCode.BAD_REQUEST_WRONG_DATA));
      error.message = "Code Decode Failed";
      return res.status(error.code).json(error);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};
