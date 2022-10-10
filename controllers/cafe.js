const Cafe = require("../models/cafe");
const { getExpireDate } = require("../methods/code");

exports.addCafe = async (req, res) => {
  try {
    // 사업자 번호, 카페 이름, 카페 위치, 구독 월 수
    const { businessNum, cafeName, location, subscribeDate } = req.body;
    console.log(businessNum, cafeName, location, subscribeDate);
    const newCafe = await Cafe.create({
      businessNum: 105015,
      cafeName: "테스트카페",
      location: "서울특별시 강남구 감자로 감자감자길 103-13",
      expireDate: getExpireDate(subscribeDate),
    });
    console.log(newCafe);
    if (newCafe) {
      return res.status(200).json({
        message: "Create Success",
        cafename: cafeName,
      });
    } else {
      console.log("Failed to Create");
      return res.status(400).json({
        message: "Failed to Create",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};

exports.checkCafeName = async (req, res) => {
  try {
    // 사업자 번호, 카페 이름, 카페 위치, 구독 월 수
    const { cafeName } = req.params;
    const cafe = await Cafe.findOne({ where: { cafeName } });
    if (cafe.cafeName === cafeName) {
      return res.status(400).json({
        message: "Name Already Existed",
      });
    } else {
      return res.status(200).json({
        message: "Name Check Success",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
