const jwt = require("jsonwebtoken");
const RateLimit = require("express-rate-limit");
const resCode = require("../libs/error");
const { Owner } = require("../models");
const multer = require("multer");
const path = require("path");

exports.checkUserOAuth = async (req, res, next) => {
  try {
    console.log(req.decoded.id);
    const user = await Owner.findOne({ id: req.decoded.id });
    if (user) {
      // 이메일 인증을 한 사용자에 한하여 다음 미들웨어로 넘어감
      if (user.provider) {
        req.user = user;
        next();
      } else {
        const error = resCode.FORBIDDEN_ERROR;
        console.log("Forbidden User");
        return res.status(error.code).json(error);
      }
    } else {
      const error = resCode.BAD_REQUEST_NO_USER;
      console.log("No User");
      return res.status(error.code).json(error);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.decoded = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // 유효기간 초과
      const errResponse = resCode.TOKEN_EXPIRED_ERROR;
      console.log(errResponse);
      return res.status(errResponse.code).json(errResponse);
    }
    console.log(error);
    const errResponse = JSON.parse(JSON.stringify(resCode.UNAUTHORIZED_ERROR));
    console.log(errResponse);
    return res.status(errResponse.code).json(errResponse);
  }
};

exports.apiLimiter = RateLimit({
  windowMs: 60 * 1000, // 1분
  max: 10,
  delayMs: 0,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode, // 기본값 429
      message: "1분에 한 번만 요청할 수 있습니다.",
    });
  },
});

exports.upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    },
  }),
});
// 관리자 권한 확인 미들웨어
exports.checkManager = async (req, res, next) => {
  try {
    if (!req.decoded.isManager) {
      const error = resCode.FORBIDDEN_ERROR;
      console.error("No Manager");
      return res.status(error.code).json(error);
    } else {
      console.log("User is Manager");
      next();
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};
