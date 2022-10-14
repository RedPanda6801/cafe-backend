const { Stamp } = require("../models");
const resCode = require("../libs/error");

exports.checkStamp = async (req, res, next) => {
  try {
    const { custPhone, cafeId } = req.params;

    const userStamp = await Stamp.findOne({
      where: { custPhone, CafeId: cafeId },
    });
    const response = {};
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
      response = JSON.parse(JSON.stringify(resCode.REQEST_SUCCESS));
      response.stamp = newStamp;
      response.message = "Create Success";
      return res.status(response.code).json(response);
    } else {
      response = JSON.parse(JSON.stringify(resCode.REQEST_SUCCESS));
      response.stamp = this.useStamp;
      response.message = "Search Success";
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};

exports.addstamp = async (req, res, next) => {
  try {
    const { custPhone, cafeId } = req.params;
    // url로 도장 개수를 강제로 추가하는 방법을 제한함
    const { addCount } = req.body;

    const stamp = await Stamp.findOne({ where: { custPhone, CafeId: cafeId } });
    if (!stamp) {
      const response = resCode.NO_SEARCH_DATA;
      console.log("NO DATA RESPONSE -", response.message);
      return res.status(response.code).json(response);
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
      const response = resCode.REQEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};

exports.useStamp = async (req, res, next) => {
  try {
    const { custPhone, cafeId } = req.params;
    // url로 도장 개수를 강제로 추가하는 방법을 제한함
    const { useCount } = req.body;

    const stamp = await Stamp.findOne({ where: { custPhone, CafeId: cafeId } });
    if (!stamp) {
      const response = resCode.NO_SEARCH_DATA;
      console.log("NO DATA RESPONSE -", response.message);
      return res.status(response.code).json(response);
    } else {
      if (stamp.leftStamp < 10) {
        const error = JSON.parse(JSON.stringify(resCode.BAD_REQEST_LACK_DATA));
        error.message = "Not Enough Stamp";
        return res.status(error.status).json(error);
      } else {
        Stamp.update(
          {
            leftStamp: stamp.leftStamp - useCount * 10,
          },
          {
            where: { custPhone, CafeId: cafeId },
          }
        );
        const response = resCode.REQEST_SUCCESS;
        return res.status(response.code).json(response);
      }
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};
