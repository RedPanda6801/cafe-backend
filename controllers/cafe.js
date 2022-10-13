const Cafe = require("../models/cafe");
const Owner = require("../models/owner");
const { getExpireDate } = require("../libs/util");
const resCode = require("../libs/error");

exports.cafeinfo = async (req, res) => {
  try {
    const mycafes = await Cafe.findAll({ where: { id: req.decoded.id } });
    // 카페 확인
    const response = {};
    if (mycafes === []) {
      response = resCode.NO_SEARCH_DATA;
    } else {
      response = resCode.REQEST_SUCCESS;
    }
    response.data = mycafes;
    return res.status(response.code).json(response);
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.addCafe = async (req, res) => {
  try {
    // 사업자 번호, 카페 이름, 카페 위치, 구독 월 수
    const { cafeName, location, businessNum, subscribeDate } = req.body;

    // 카페 중복 예외처리 필요!
    const newCafe = await Cafe.create({
      cafeName: cafeName,
      location: location,
      businessNum: businessNum,
      expireDate: getExpireDate(subscribeDate),
      OwnerId: req.decoded.id,
    });
    const cafeData = newCafe.dataValues;
    // 카페 생성 확인 예외처리
    if (!cafeData || cafeData === {}) {
      const error = resCode.BAD_REQEST_WRONG_DATA;
      return res.status(error.code).json(error);
    } else {
      const response = resCode.REQEST_SUCCESS;
      response.cafe = cafeData;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.updatecafe = async (req, res) => {
  try {
    // 수정할 값은 하나만 들어와도 수정되어야 한다.
    const { cafeName, location, businessNum } = req.body;
    const { cafeId } = req.params;
    const formData = req.files;

    const icon = formData[1] && formData[1].filename;
    const img = formData[0] && formData[0].filename;

    if (
      !(await Cafe.findOne({ where: { id: cafeId, OwnerId: req.decoded.id } }))
    ) {
      const response = resCode.NO_SEARCH_DATA;
      console.log(response.message);
      return res.status(response.code).json(response);
    } else {
      await Cafe.update(
        {
          cafeName: cafeName ? cafeName : cafe.cafeName,
          location: location ? location : cafe.location,
          businessNum: businessNum ? businessNum : cafe.businessNum,
          icon: icon ? icon : cafe.icon,
          img: img ? img : cafe.img,
        },
        {
          where: { id: req.decoded.id },
        }
      );
      const response = resCode.REQEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

// 여기부터 내일 해야함
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

// 카페이름 중복 확인 API, 사용 여부 확인 필요
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
