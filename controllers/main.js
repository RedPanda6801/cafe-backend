const path = require("path");
exports.getMain = async (req, res) => {
  try {
    return res.sendFile(path.join(__dirname, "../socket.html"));
  } catch (error) {
    console.log(error);
  }
};
