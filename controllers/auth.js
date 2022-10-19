const { Owner } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resCode = require("../libs/error");

const mailList = ["naver", "daum", "gmail", "kakao", "hanmail"];

exports.signup = async (req, res, next) => {
  try {
    const { email, password, userId, name, phone } = req.body;
    // body 확인 예외처리
    if (!email || !password || !userId || !name || !phone) {
      const error = resCode.BAD_REQUEST_LACK_DATA;
      console.log("ERROR :", error);
      return res.status(error.code).json(error);
    }
    // 유효 도메인 확인 예외 처리
    const provider = email.split("@")[1].split(".")[0];
    if (!mailList.find((mail) => mail === provider)) {
      const error = JSON.parse(JSON.stringify(resCode.BAD_REQUEST_WRONG_DATA));
      error.message = "Doamin didn't Provided";
      console.log("ERROR :", error);
      return res.status(error.code).json(error);
    }
    // 이메일 중복 확인 예외 처리
    if (await Owner.findOne({ where: { email } })) {
      const error = resCode.BAD_REQUEST_EXIESTED;
      console.log("ERROR :", error);
      return res.status(error.code).json(error);
    } else if (await Owner.findOne({ where: { userId } })) {
      const error = resCode.BAD_REQUEST_EXIESTED;
      console.log("ERROR :", error);
      return res.status(error.code).json(error);
    } else {
      // 관리자 권한 부여
      isManager = name == "root" && password == "root" ? true : false;
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
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    // 아이디, 비밀번호가 들어왔는지 확인
    if (!userId || !password) {
      const error = resCode.BAD_REQUEST_LACK_DATA;
      console.error(error);
      return res.status(error.code).json(error);
    }
    // 회원가입 정보를 확인
    const owner = await Owner.findOne({ where: { userId } });
    console.log(owner.password);
    console.log(await bcrypt.compare(password, owner.password));
    if (!owner) {
      const error = JSON.parse(JSON.stringify(resCode.BAD_REQUEST_NO_USER));
      error.message = "User is not Joinned";
      return res.status(error.code).json(error);
    } else if (!(await bcrypt.compare(password, owner.password))) {
      const error = JSON.parse(JSON.stringify(resCode.BAD_REQUEST_WRONG_DATA));
      error.message = "Wrong Password";
      return res.status(error.code).json(error);
    } else {
      // 토큰을 가지고 있는 사용자인지 확인
      if (req.session.jwt) {
        const error = JSON.parse(
          JSON.stringify(resCode.BAD_REQUEST_WRONG_DATA)
        );
        error.message = "You are already Logged In!";
        error.token = req.headers.authorization.split(" ")[1];
        return res.status(error.code).json(error);
      }
      // 토큰 지급
      const accessToken = jwt.sign(
        {
          id: owner.id,
          isManager: owner.isManager,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1440m", // 리프레시가 없을때 일단 이렇게 사용
          issuer: "Cafe Managers",
        }
      );
      // const refreashToken = jwt.sign(
      //   {
      //     id: owner.id,
      //     isManager: owner.isManager,
      //   },
      //   process.env.JWT_SECRET,
      //   {
      //     expiresIn: "1440m", // refreashToken은 유효기간이 하루
      //     issuer: "Cafe Managers",
      //   }
      // );
      req.session.jwt = accessToken;
      const response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
      response.token = accessToken;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.log("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.checkEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    if (await Owner.findOne({ where: { email } })) {
      const error = resCode.BAD_REQUEST_EXIESTED;
      console.error("ERROR :", error.message);
      return res.status(error.code).json(error);
    } else {
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};
exports.checkUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (await Owner.findOne({ where: { userId } })) {
      const error = resCode.BAD_REQUEST_EXIESTED;
      console.error("ERROR :", error.message);
      return res.status(error.code).json(error);
    } else {
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};
