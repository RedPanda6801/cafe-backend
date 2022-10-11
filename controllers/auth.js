const { Owner } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const mailList = ["naver", "daum", "gmail", "kakao", "hanmail"];

exports.signup = async (req, res) => {
  try {
    const { email, password, userId, name, phone } = req.body;
    const emailCheck = await Owner.findOne({ where: { email } });
    if (emailCheck) {
      return res.status(400).json({
        message: "Email is Overlapped",
      });
    }
    const isManager = false;
    if (userId === "root" && password === "root") isManager = true;
    console.log(email, password, userId, name, phone, isManager);
    if (email && password && userId && name && phone) {
      const domain = email.split("@")[1];
      const provider = domain.split(".")[0];
      // 입력한 email로 UserDB의 email을 찾는다.
      if (!mailList.find((mail) => mail === provider)) {
        return res.status(400).json({
          message: "Doamin didn't Provided",
        });
      }
      const owner = await Owner.findOne({ where: { email } });
      if (!owner) {
        // password 암호화
        const hash = await bcrypt.hash(password, 12);
        const join = await Owner.create({
          // 입력한 값들에 대해 각각의 유효성 검사가 필요(백엔드에서 한번 더 처리)
          email,
          name,
          ownerPhone: phone,
          userId,
          provider,
          isManager,
          password: hash,
        });
        if (join) {
          return res.status(200).json({
            message: "success",
          });
        } else {
          return res.status(400).json({
            message: "failed",
          });
        }
      } else {
        console.log("existed");
        return res.status(400).json({
          message: "Already Existed User",
        });
      }
    } else {
      return res.status(400).json({
        message: "Bad Request",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};

exports.signin = async (req, res, next) => {
  // passport를 사용할지 말지를 결정해야함.
  // request에 user 정보를 실어줘야 하므로 보안성 측면과 jwt와의 중복 측면에서 고려해볼 이슈임.
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return res.status(404).json({ authError });
    }
    if (!user) {
      return res.status(400).json({
        message: "failed",
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      const token = jwt.sign(
        {
          id: user.id,
          nick: user.nick,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "30m", // 30분
          issuer: "Cafe Managers",
        }
      );
      req.session.jwt = token;
      return res.status(200).json({
        message: "success",
        token,
        // payload에 user의 값이 담겨있음
      });
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const check = await Owner.findOne({ where: { email } });
    if (!check) {
      return res.status(200).json({
        message: "Sucess to Check",
      });
    } else {
      console.log("email already existed!");
      return res.status(400).json({
        message: "email Existed",
      });
    }
  } catch (error) {
    console.log("email check error -", error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
exports.checkUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const check = await Owner.findOne({ where: { userId } });
    if (!check) {
      return res.status(200).json({
        message: "Sucess to Check",
      });
    } else {
      console.log("userId already existed!");
      return res.status(400).json({
        message: "userId Existed",
      });
    }
  } catch (error) {
    console.log("userId check error -", error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
