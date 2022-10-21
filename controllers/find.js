const { makeEmail, getTempPassword } = require("../libs/util");
const { Owner } = require("../models");
const resCode = require("../libs/error");
const bcrypt = require("bcrypt");

exports.sendUserId = async (req, res, next) => {
  try {
    const { email, name } = req.params;
    const owner = await Owner.findOne({ where: { email, name } });
    if (owner) {
      // 입력한 이메일이 있다면
      const userId = owner.userId;
      const editUserId = userId.substring(0, userId.length - 3);
      const subject = "아이디 찾기 메일 - 마이스탬프";
      const html = `<h1>아이디 찾기 메일입니다.</h1>
      <h3>당신의 아이디는 ${editUserId}*** 입니다.</h3>
      <h3>로그인을 원하신다면 다시 로그인을 시도해주세요.</h3>`;

      const emailMaker = makeEmail(html, subject, email);
      info = await emailMaker[0].sendMail(emailMaker[1]);
      console.log("Mail Info : response -", info);
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    } else {
      // 이메일이 없다면
      const error = resCode.BAD_REQUEST_NO_USER;
      console.error("ERROR :", error);
      return res.status(error.code).json(error);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.findPassword = async (req, res, next) => {
  try {
    const { email, name, userId } = req.body;
    const owner = await Owner.findOne({
      where: {
        email,
        name,
        userId,
      },
    });
    console.log(owner);
    if (owner) {
      console.log(owner.userId, owner.name);
      const tempPassword = getTempPassword();
      const encodingPassword = await bcrypt.hash(tempPassword, 12);
      const update = await Owner.update(
        {
          password: encodingPassword,
        },
        { where: { email, name, userId } }
      );
      console.log(await bcrypt.compare(tempPassword, encodingPassword));
      const html = `<h1>비밀번호 변경 메일입니다.</h1>
      <h3>임시 비밀번호는 ${tempPassword} 입니다.</h3>
      <h3>로그인 후에 반드시 비밀번호를 변경해주세요.</h3>  `;
      const subject = "비밀번호 변경 메일 - 마이스탬프";
      const emailMaker = makeEmail(html, subject, owner.email);
      const info = await emailMaker[0].sendMail(emailMaker[1]);
      console.log("Mail Info : ", info);
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    } else {
      const error = resCode.BAD_REQUEST_NO_USER;
      return res.status(error.code).json(error);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};
