const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const cors = require("cors");

dotenv.config();

// 라우터 불러오기
const mailRouter = require("./routes/mail");
const authRouter = require("./routes/auth");
const cafeRouter = require("./routes/cafe");
const profileRouter = require("./routes/profile");
const findRouter = require("./routes/find");
const stampRouter = require("./routes/stamp");
const customerRouter = require("./routes/customer");
const questionRouter = require("./routes/question");

const resCode = require("./libs/error");
const { sequelize } = require("./models");

const app = express();
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
// 라우터 설정
app.use("/mail", mailRouter);
app.use("/auth", authRouter);
app.use("/cafe", cafeRouter);
app.use("/profile", profileRouter);
app.use("/find", findRouter);
app.use("/stamp", stampRouter);
app.use("/customer", customerRouter);
app.use("/question", questionRouter);

// 404 NOT FOUND
app.use((req, res, next) => {
  console.log(req.query.error);
  if (res.statusCode !== 500) {
    const error = resCode.NOT_FOUND;
    return res.status(error.code).json(error);
  } else next();
});

app.use((err, req, res, next) => {
  console.log(err);
  res.locals.message = err.message;
  const response = {};
  if (err.name === "SequelizeDatabaseError") {
    response.message = "DB ERROR";
  }
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500).json(response || err);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});
