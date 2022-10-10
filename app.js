const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");

dotenv.config();

// 라우터 불러오기
const mailRouter = require("./routes/mail");
const authRouter = require("./routes/auth");
const cafeRouter = require("./routes/cafe");
const profileRouter = require("./routes/profile");

const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 8002);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });
app.use(morgan("dev"));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  cors({
    credentials: true,
  })
);
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 라우터 설정
app.use("/mail", mailRouter);
app.use("/auth", authRouter);
app.use("/cafe", cafeRouter);
app.use("/profile", profileRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.log(err);
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.json({
    code: 500,
    message: "서버 오류",
  });
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
