const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const cors = require("cors");
const webSocket = require("./socket");

dotenv.config();

// 라우터 불러오기
const mailRouter = require("./routes/mail");
const authRouter = require("./routes/auth");
const cafeRouter = require("./routes/cafe");
const profileRouter = require("./routes/profile");
const findRouter = require("./routes/find");
const stampRouter = require("./routes/stamp");
const questionRouter = require("./routes/question");
const solutionRouter = require("./routes/solution");
const mainRouter = require("./routes/main");

const resCode = require("./libs/error");
const { sequelize, Solution } = require("./models");

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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
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
app.use("/question", questionRouter);
app.use("/solution", solutionRouter);
app.use("/main", mainRouter);
// 404 NOT FOUND
app.use((req, res, next) => {
  if (res.statusCode !== 500) {
    const error = resCode.NOT_FOUND;
    console.error(`Router Not Found! - ${req.method}${req.url}`);
    return res.status(error.code).json(error);
  } else next();
});

app.use((err, req, res) => {
  console.log(req.query.error);
  console.log("error name - ", err.name || "notFound");
  res.locals.message = err.message;
  let response = {};
  if (err.name === "SequelizeDatabaseError") {
    response.message = "DB ERROR";
  } else if (err.name === "TypeError") {
    response.massage = "TypeError - dataType problem or DB is not allowed Null";
  }
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500).json(response || err);
});

const server = app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

webSocket(server, app);
