const { Customer, Stamp, Cafe } = require("../models");

// 카페마다의 고객정보를 조회할 수 있다.
exports.infoCustomer = async (req, res) => {
  try {
    const { cafeId } = req.params;

    const custStamp = await Stamp.findAll({ where: { CafeId: cafeId } });
    if (custStamp.length) {
      return res.status(200).json({
        message: "Customer Search Success",
        customers: custStamp,
      });
    } else {
      console.log("No Customer in your Cafe");
      return res.status(204).json({
        meesage: "No Customer in you Cafe",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
