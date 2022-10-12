const Cafe = require("../models/cafe");
const Owner = require("../models/owner");

const { getExpireDate } = require("../methods/code");

exports.addCafe = async (req, res) => {
  try {
    // 사업자 번호, 카페 이름, 카페 위치, 구독 월 수
    const { cafeName, location, businessNum, subscribeDate } = req.body;
    console.log(businessNum, cafeName, location, subscribeDate);
    const newCafe = await Cafe.create({
      cafeName: cafeName,
      location: location,
      businessNum: businessNum,
      expireDate: getExpireDate(subscribeDate),
      OwnerId: req.decoded.id,
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
exports.cafeinfo = async (req, res) => {
  try {
    const mycafe = await Cafe.findOne({ where: { id: req.decoded.id } });
    console.log(mycafe);
    if (mycafe) {
      return res.status(200).json({
        message: "Cafe Infomation Success",
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

exports.updatecafe = async (req, res) => {
  try {
    const { cafeName, location, businessNum } = req.body;
    const cafe = await Cafe.findOne({ where: { id: req.decoded.id } });
    if (cafe) {
      const renewCafe = await Cafe.update(
        {
          cafeName: cafeName ? cafeName : cafe.cafeName,
          location: location ? location : cafe.location,
          businessNum: businessNum ? businessNum : cafe.businessNum,
        },
        {
          where: { id: req.decoded.id },
        }
      );
      if (renewCafe) {
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

exports.removecafe = async (req, res) => {
  try {
    const { cafeName } = req.params;
    console.log(cafeName);
    const cafe = await Cafe.findOne({ where: { cafeName } });
    console.log(cafe);
    if (!cafe.id) {
      await Cafe.destroy({ where: { cafeName } });
      res.status(200).json({
        message: "Remove Success",
      });
    } else {
      console.log("cafeName error");
      res.status(400).json({
        message: "cafeName Error",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
