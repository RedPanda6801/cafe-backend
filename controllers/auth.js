const { Owner } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const resCode = require("../libs/error");
const { json } = require("sequelize");

const mailList = ["naver", "daum", "gmail", "kakao", "hanmail"];

exports.signup = async (req, res) => {
  try {
    const { email, password, userId, name, isManager, phone } = req.body;
    // body 확인 예외처리
    if (!email || !password || !userId || !name || !phone) {
      const error = resCode.BAD_REQEST_LACK_DATA;
      console.log("ERROR :", error.message);
      return res.status(error.code).json(error);
    }
    // 유효 도메인 확인 예외 처리
    const provider = email.split("@")[1].split(".")[0];
    if (!mailList.find((mail) => mail === provider)) {
      const error = resCode.BAD_REQEST_WRONG_DATA;
      error.message = "Doamin didn't Provided";
      console.log("ERROR :", error.message);
      return res.status(error.code).json(error);
    }
    // 이메일 중복 확인 예외 처리
    if (await Owner.findOne({ where: { email } })) {
      const error = resCode.BAD_REQUEST_EXIESTED;
      console.log("ERROR :", error.message);
      return res.status(error.code).json(error);
    } else {
      // 관리자 권한 부여
      isManger = name == "root" ? true : false;
      // password 암호화
      const hash = await bcrypt.hash(password, 12);
      await Owner.create({
        // 입력한 값들에 대해 각각의 유효성 검사가 필요(백엔드에서 한번 더 처리)
        email,
        name,
        ownerPhone: phone,
        userId,
        provider,
        isManager,
        password: hash,
      });
      const response = resCode.REQEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error("ERROR :", authError);
      return res.status(404).json({ authError });
    }
    if (!user) {
      const error = resCode.BAD_REQUEST_NO_USER;
      console.log("ERROR :", error.message);
      return res.status(error.code).json(error);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error("ERROR :", loginError);
        return next(loginError);
      }
      // 토큰 지급
      const token = jwt.sign(
        {
          id: user.id,
          isManager: user.isManager,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30m", // 30분
          issuer: "Cafe Managers",
        }
      );
      req.session.jwt = token;
      const response = JSON.parse(JSON.stringify(resCode.REQEST_SUCCESS));
      response.token = token;
      return res.status(response.code).json(response);
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (await Owner.findOne({ where: { email } })) {
      const error = resCode.BAD_REQUEST_EXIESTED;
      console.error("ERROR :", error.message);
      return res.status(error.code).json(error);
    } else {
      const response = resCode.REQEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};
exports.checkUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (await Owner.findOne({ where: { userId } })) {
      const error = resCode.BAD_REQUEST_EXIESTED;
      console.error(error.code);
      return res.status(error.code).json(error);
    } else {
      const response = resCode.REQEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};
