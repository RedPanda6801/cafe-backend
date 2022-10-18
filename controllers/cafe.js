const Cafe = require("../models/cafe");
const { getExpireDate } = require("../libs/util");
const resCode = require("../libs/error");

exports.cafeinfo = async (req, res, next) => {
  try {
    const mycafes = await Cafe.findAll({ where: { OwnerId: req.decoded.id } });
    // 카페 확인
    let response = {};
    if (mycafes === []) {
      response = JSON.parse(JSON.stringify(resCode.NO_SEARCH_DATA));
    } else {
      response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
    }
    response.data = mycafes;
    return res.status(response.code).json(response);
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};

exports.cafeoneinfo = async (req, res, next) => {
  try {
    const { cafeId } = req.params;
    if (!cafeId) {
      const error = resCode.BAD_REQUEST_LACK_DATA;
      console.error(error.message);
      return res.status(error.code).json(error);
    }
    const cafe = await Cafe.findOne({
      where: { id: cafeId, OwnerId: req.decoded.id },
    });
    const response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
    response.data = cafe;
    return res.status(response.code).json(response);
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};

exports.addCafe = async (req, res, next) => {
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
      const error = resCode.BAD_REQUEST_WRONG_DATA;
      return res.status(error.code).json(error);
    } else {
      const response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
      response.cafe = cafeData;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};

exports.updatecafe = async (req, res, next) => {
  try {
    // 수정할 값은 하나만 들어와도 수정되어야 한다.
    const { cafeName, location, businessNum } = req.body;
    const { cafeId } = req.params;
    const formData = req.files;
    let icon = "";
    let img = "";
    if (formData) {
      icon = formData["icon"] ? formData["icon"].filename : null;
      img = formData["img"] ? formData["img"].filename : null;
    } else {
      icon = null;
      img = null;
    }

    const cafe = await Cafe.findOne({
      where: { id: cafeId, OwnerId: req.decoded.id },
    });
    if (!cafe) {
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
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};

// 여기부터 내일 해야함
exports.removecafe = async (req, res, next) => {
  try {
    // 카페가 있는지 확인해야하나?
    const { cafeId } = req.params;
    // DB에서 삭제
    if (
      !(await Cafe.destroy({
        where: { id: cafeId, OwnerId: req.decoded.id },
      }))
    ) {
      const error = resCode.UNAUTHORIZED_ERROR;
      res.status(error.code).json(error);
    } else {
      // 카페 아이디와 점주가 카페 DB에 있으면 삭제
      const response = resCode.REQUEST_SUCCESS;
      res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};

// 카페 중복 확인 API
exports.checkCafe = async (req, res, next) => {
  try {
    // 사업자 번호, 카페 이름, 카페 위치, 구독 월 수
    const { cafeName } = req.params;
    const cafe = await Cafe.findOne({
      where: { cafeName, OwnerId: req.decoded.id },
    });
    if (cafe) {
      const error = resCode.BAD_REQUEST_EXIESTED;
      return res.status(error.code).json(error);
    } else {
      const response = resCode.NO_SEARCH_DATA;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};
