const jwt = require("jsonwebtoken");
const RateLimit = require("express-rate-limit");

const { Owner, Customer } = require("../models");
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
        console.log("Forbidden User");
        res.status(403).json({
          message: "Forbidden Error",
        });
      }
    } else {
      console.log("No User");
      res.status(400).json({ message: "No User" });
    }
  } catch (error) {
    res.status(404).json({ message: "Failed" });
  }
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent("로그인한 상태입니다.");
    res.redirect(`/?error=${message}`);
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
      return res.json({
        code: 419,
        message: "토큰이 만료되었습니다",
      });
    }
    return res.json({
      code: 401,
      message: "유효하지 않은 토큰입니다",
    });
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


exports.checkCustomer = async (req, res, next) => {
  try {
    const { custPhone } = req.params;
    const customer = await Customer.findOne({ where: { custPhone } });
    if (!customer) {
      await Customer.create({ custPhone });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Failed to Read Phone Number",
    });
  }
};
