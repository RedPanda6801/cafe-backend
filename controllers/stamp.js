const { Stamp, Cafe } = require("../models");
const resCode = require("../libs/error");

exports.searchallstamp = async (req, res, next) => {
  try {
    const { cafeId } = req.params;
    console.log(req.decoded.id);
    const custStamp = await Stamp.findAll({ where: { CafeId: cafeId } });
    if (custStamp.length) {
      const response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
      response.customers = custStamp;
      return res.status(response.code).json(response);
    } else {
      console.log("No Customer in your Cafe");
      const error = resCode.BAD_REQUEST_NO_USER;
      return res.status(error.code).json(error);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};
exports.searchStamp = async (req, res, next) => {
  try {
    const { custPhone, cafeId } = req.params;

    const userStamp = await Stamp.findOne({
      where: { custPhone, CafeId: cafeId },
    });
    let response = {};
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
      response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
      response.data = {
        stamp: newStamp,
        message: "Create Success",
      };
      return res.status(response.code).json(response);
    } else {
      response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
      response.data = {
        stamp: userStamp,
        message: "Search Success",
      };
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
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
      console.log("NO DATA RESPONSE -", response);
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
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
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
      console.log("NO DATA RESPONSE -", response);
      return res.status(response.code).json(response);
    } else {
      if (stamp.leftStamp < 10 || stamp.leftStamp < useCount * 10) {
        const error = JSON.parse(JSON.stringify(resCode.BAD_REQUEST_LACK_DATA));
        error.message = "Not Enough Stamp";
        return res.status(error.code).json(error);
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
        return res.status(response.code).json(response);
      }
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.updatememo = async (req, res, next) => {
  try {
    const { cafeId, custPhone } = req.params;
    const { memo } = req.body;

    const cafe = await Cafe.findOne({
      where: { id: cafeId, OwnerId: req.decoded.id },
    });
    if (!cafe) {
      const error = resCode.BAD_REQUEST_WRONG_DATA;
      console.error("No Cafe in DB");
      return res.status(error.code).json(error);
    } else {
      await Stamp.update({ memo }, { where: { CafeId: cafeId, custPhone } });
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};
