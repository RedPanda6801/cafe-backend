const { Stamp } = require("../models");
const resCode = require("../libs/error");

// 카페마다의 고객정보를 조회할 수 있다.
exports.infoCustomer = async (req, res, next) => {
  try {
    const { cafeId } = req.params;

    const custStamp = await Stamp.findAll({ where: { CafeId: cafeId } });
    if (custStamp.length) {
      const response = resCode.REQUEST_SUCCESS;
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
