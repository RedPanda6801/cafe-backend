const { Stamp } = require("../models");

// exports.addstamp = async (req, res) => {
//   try {
//     const { count } = req.body;
//     const stamp = await Stamp.findOne({ where: { id: req.decoded.id } });
//     if (stamp) {
//       const sumstamp = await Stamp.update(
//         {
//           count,
//         },
//         {
//           where: { id: req.decoded.id },
//         }
//       );
//       if (sumstamp) {
//         return res.status(200).json({
//           message: "Update Success",
//         });
//       } else {
//         return res.status(400).json({
//           message: "Update Failed",
//         });
//       }
//     } else {
//       return res.status(403).json({
//         message: "Forbidden",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(404).json({
//       message: "Not Found",
//     });
//   }
// };

exports.searchstamp = async (req, res) => {
  try {
    const { custPhone, cafeId } = req.params;

    const userStamp = await Stamp.findOne({
      where: { custPhone, CafeId: cafeId },
    });
    // 스탬프를 조회해서 없다면 스탬프 추가
    if (!userStamp) {
      const newStamp = await Stamp.create({
        stackStamp: 0,
        leftStamp: 0,
        CafeId: cafeId,
        custPhone,
      });
      return res.status(200).json({
        message: "Create Stamp Success",
        stamp: newStamp,
      });
    } else {
      return res.status(200).json({
        message: "Search Stamp Scuccess",
        stamp: userStamp,
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
