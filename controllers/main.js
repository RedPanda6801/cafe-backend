const path = require("path");
exports.getTablet = async (req, res) => {
  try {
    return res.sendFile(path.join(__dirname, "../tablet.html"));
  } catch (error) {
    console.log(error);
  }
};
exports.getPhone = async (req, res) => {
  try {
    return res.sendFile(path.join(__dirname, "../phone.html"));
  } catch (error) {
    console.log(error);
  }
};
