const SocketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const { Stamp } = require("./models");
const resCode = require("./libs/error");

module.exports = (server, app) => {
  const io = SocketIO(server, { path: "/socket.io" });
  // io.use(
  //   socketioJwt.authorize({
  //     secret: "your secret or public key",
  //     handshake: true,
  //   })
  // );
  app.set("io", io);
  const tablet = io.of("/tablet");
  const phone = io.of("/phone");

  phone.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      console.log("websocket connects phone -", socket.id);

      socket.on("error", (error) => {
        console.error(error);
      });

      socket.on("stack", async (data) => {
        try {
          const { custPhone, cafeId, addCount } = data;
          console.log("스탬프 추가 request - ", custPhone, cafeId, addCount);
          const stamp = await Stamp.findOne({
            where: { custPhone, CafeId: cafeId },
          });
          if (!stamp) {
            const error = resCode.BAD_REQUEST_NO_USER;
            console.log("ERROR -", error.message);
            tablet.emit("error", error);
          } else {
            Stamp.update(
              {
                stackStamp: stamp.stackStamp + addCount,
                leftStamp: stamp.leftStamp + addCount,
                visit: stamp.visit + 1,
              },
              {
                where: { custPhone, CafeId: cafeId },
              }
            );
            const response = resCode.REQUEST_SUCCESS;
            console.log(response);
            tablet.emit("success", response);
          }
        } catch (error) {
          console.log(error);
          tablet.emit("error", error);
        }
      });

      socket.on("use", async (data) => {
        try {
          const { custPhone, cafeId, useCount } = data;
          console.log("스탬프 추가 request - ", custPhone, cafeId, useCount);
          const stamp = await Stamp.findOne({
            where: { custPhone, CafeId: cafeId },
          });
          if (!stamp) {
            const error = resCode.BAD_REQUEST_NO_USER;
            console.log("ERROR -", error.message);
            tablet.emit("error", error);
          } else {
            if (stamp.leftStamp < 10 || stamp.leftStamp < useCount * 10) {
              const error = JSON.parse(
                JSON.stringify(resCode.BAD_REQUEST_LACK_DATA)
              );
              error.message = "Not Enough Stamp";
              tablet.emit("error", error);
            } else {
              Stamp.update(
                {
                  leftStamp: stamp.leftStamp - useCount * 10,
                },
                {
                  where: { custPhone, CafeId: cafeId },
                }
              );
              const response = resCode.REQUEST_SUCCESS;
              tablet.emit("success", response);
            }
          }
        } catch (error) {
          console.log(error);
          tablet.emit("error", error);
        }
      });

      socket.on("cancel", (data) => {
        tablet.emit("success", data);
      });
    } catch (error) {
      socket.on("disconnect", () => {
        let error = {};
        if (error.name === "TokenExpiredError") {
          // 유효기간 초과
          error = {
            code: 419,
            message: "토큰이 만료되었습니다",
          };
          socket.on("error", error);
        } else {
          error = {
            code: 401,
            message: "유효하지 않은 토큰입니다",
          };
        }
        socket.on("error", error);
      });
    }
  });
  tablet.on("connection", (socket) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      console.log("websocket connects phone -", socket.id);

      socket.on("error", (error) => {
        console.error(error);
      });
      // 전화번호를 받아 DB를 조회해주는 코드
      socket.on("search", async (data) => {
        try {
          const { custPhone, cafeId } = data;
          const stamp = await Stamp.findOne({
            where: { custPhone, CafeId: cafeId },
          });
          console.log(stamp);
          if (!stamp) {
            const error = resCode.BAD_REQUEST_NO_USER;
            console.log(error.message);
            phone.emit("error", error);
          } else {
            const response = JSON.parse(
              JSON.stringify(resCode.REQUEST_SUCCESS)
            );
            response.data = stamp;
            phone.emit("success", response);
          }
        } catch (error) {
          console.log(error);
          phone.emit("error", error);
        }
      });
    } catch (error) {
      socket.on("disconnect", () => {
        let error = {};
        if (error.name === "TokenExpiredError") {
          // 유효기간 초과
          error = {
            code: 419,
            message: "토큰이 만료되었습니다",
          };
          socket.on("error", error);
        } else {
          error = {
            code: 401,
            message: "유효하지 않은 토큰입니다",
          };
        }
        socket.on("error", error);
      });
    }
  });
};

// emit으로 보내고 on으로 받는다.
// io.of로 라우터처럼 사용할 수 있다.
