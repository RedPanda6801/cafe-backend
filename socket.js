const SocketIO = require("socket.io");
const socketioJwt = require("socketio-jwt");

module.exports = (server, app) => {
  const io = SocketIO(server, { path: "/socket.io" });
  // io.use(
  //   socketioJwt.authorize({
  //     secret: "your secret or public key",
  //     handshake: true,
  //   })
  // );
  app.set("io", io);
  const chat = io.of("/chat");
  chat.on("connection", (socket) => {
    const req = socket.request;
    // if (req.headers.authorization) {
    // const token = req.headers.authorization.split(" ")[1];
    // req.decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("websocket connects");
    socket.on("disconnect", () => {
      console.log("클라이언트 접속 해제", socket.id);
      clearInterval(socket.interval);
    });

    socket.on("error", (error) => {
      console.error(error);
    });
    socket.on("reply", (data) => {
      console.log(data);
    });
    socket.emit("news", "hi");
    // } else {
    // console.log("Connection Failed");
  });
};

// emit으로 보내고 on으로 받는다.
// io.of로 라우터처럼 사용할 수 있다.
