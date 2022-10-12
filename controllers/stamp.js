const { Stamp } = require("../models");

exports.addstamp = async (req, res) => {
  try {
    const { count } = req.body;
    const stamp = await Stamp.findOne({ where: { id: req.decoded.id } });
    if (stamp) {
      const sumstamp = await Stamp.update(
        {
          count,
        },
        {
          where: { id: req.decoded.id },
        }
      );
      if (sumstamp) {
        return res.status(200).json({
          message: "Update Success",
        });
      } else {
        return res.status(400).json({
          message: "Update Failed",
        });
      }
    } else {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
exports.inquirestamp = async (req, res) => {
  try {
    const readstamp = await Stamp.findOne({ where: { id: req.decoded.id } });
    console.log(readstamp);
    if (readstamp) {
      return res.status(200).json({
        message: "Stamp Read Success",
        stampcount: readstamp,
      });
    } else {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
// 쿠폰 삭제는 일시정지
// exports.removestamp = async (req, res) => {
//   try {
//     const
//   }
//   catch (error) {

//   }
// };
