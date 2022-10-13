const { Stamp } = require("../models");

exports.checkStamp = async (req, res) => {
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
        visit: 0,
        memo: "",
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

exports.addstamp = async (req, res) => {
  try {
    const { custPhone, cafeId } = req.params;
    // url로 도장 개수를 강제로 추가하는 방법을 제한함
    const { addCount } = req.body;

    const stamp = await Stamp.findOne({ where: { custPhone, CafeId: cafeId } });
    if (stamp) {
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
      return res.status(200).json({
        message: "Adding Stamp Success",
      });
    } else {
      return res.status(400).json({
        message: "Customer didn't have Stamp",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};

exports.useStamp = async (req, res) => {
  try {
    const { custPhone, cafeId } = req.params;
    // url로 도장 개수를 강제로 추가하는 방법을 제한함
    const { useCount } = req.body;

    const stamp = await Stamp.findOne({ where: { custPhone, CafeId: cafeId } });
    if (stamp) {
      if (stamp.leftStamp < 10) {
        return res.status(400).json({
          message: "Not Enough Stamp",
        });
      }
      Stamp.update(
        {
          leftStamp: stamp.leftStamp - useCount * 10,
        },
        {
          where: { custPhone, CafeId: cafeId },
        }
      );
      return res.status(200).json({
        message: "Using Stamp Success",
      });
    } else {
      return res.status(400).json({
        message: "Customer didn't have Stamp",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
