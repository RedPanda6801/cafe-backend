const nodemailer = require("nodemailer");
const { getAuthCode } = require("../methods/code");
const { Owner } = require("../models");
const bcrypt = require("bcrypt");

exports.emailsender = async (req, res) => {
  try {
    const { email } = req.params;
    const owner = await Owner.findOne({ where: { email } });
    if (owner) {
      return res.status(400).json({ message: "Already User Existed" });
    }
    const code = getAuthCode();
    if (code && email) {
      // email과 code가 유효하면 메일을 보냄
      let transporter = nodemailer.createTransport({
        service: "Naver",
        host: "smtp.naver.com",
        port: 465,
        auth: {
          user: process.env.EMAIL, // generated ethereal user
          pass: process.env.PASSWORD, // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: "TLSv1.2",
        },
      });

      let mailOption = {
        from: process.env.EMAIL,
        to: email, // list of receivers
        subject: "Hello ✔", // Subject line
        html: `<h1>이메일 인증 코드입니다.</h1>
        <h2>${code}</h2>
        <h3>인증 화면으로 돌아가 입력해주세요.</h3>`, // html body
      };
      // LocalStorage에 저장하되, 암호화하여 저장 -> 코드 인증 시에 복호화하여 비교
      const hashCode = await bcrypt.hash(code, 12);
      console.log(hashCode);
      try {
        info = await transporter.sendMail(mailOption);
        console.log("메일 정보: ", info);
        return res.status(200).json({
          message: "Sending Success",
          user: {
            hash: hashCode,
            email,
          },
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          message: "Email Sending Failed",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};

exports.emailauth = async (req, res) => {
  try {
    const { email, code, hash } = req.body;
    // 복호화 해줌
    const result = await bcrypt.compare(code, hash);
    console.log(result);
    if (result) {
      return res.status(200).json({
        message: "Decoding Success",
        email,
      });
    } else {
      return res.status(401).json({
        message: "Decoding Failed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
