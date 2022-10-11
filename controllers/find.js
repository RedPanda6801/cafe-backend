const { makeEmail, getTempPassword } = require("../methods/code");
const { Owner } = require("../models");

exports.sendUserId = async (req, res) => {
  try {
    const { email } = req.params;
    const owner = await Owner.findOne({ where: { email } });
    if (owner) {
      // 입력한 이메일이 있다면
      const userId = owner.userId;
      const editUserId = userId.substring(0, userId.length - 3);
      const subject = "아이디 찾기 메일 - 감자 카페";
      const html = `<h1>아이디 찾기 메일입니다.</h1>
      <h3>당신의 아이디는 ${editUserId}*** 입니다.</h3>
      <h3>로그인을 원하신다면 다시 로그인을 시도해주세요.</h3>`;

      const emailMaker = makeEmail(html, subject, email);
      try {
        info = await emailMaker[0].sendMail(emailMaker[1]);
        console.log("Mail Info : response -", info);
        return res.status(200).json({
          message: "Sending Success",
        });
      } catch (error) {
        console.log("Email Send Error : response -", error);
        return res.status(400).json({
          message: "Email Send Error",
        });
      }
    } else {
      // 이메일이 없다면
      console.log("No Owner in DB");
      return res.status(400).json({
        message: "No Owner",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};

exports.findPassword = async (req, res) => {
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

      const html = `<h1>비밀번호 변경 메일입니다.</h1>
      <h3>임시 비밀번호는 ${getTempPassword} 입니다.</h3>
      <h3>로그인 후에 반드시 비밀번호를 변경해주세요.</h3>  `;
      const subject = "비밀번호 변경 메일 - 감자 카페";
      const emailMaker = makeEmail(html, subject, owner.email);
      try {
        const info = emailMaker[0].sendMail(emailMaker[1]);
        console.log("Mail Info : ", info);
        return res.status(200).json({
          message: "Sending Sucess",
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          message: "Email Send Failed",
        });
      }
    } else {
      console.log("No User");
      return res.status(400).json({
        message: "No User",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
