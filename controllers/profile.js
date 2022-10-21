const { Owner } = require("../models");
const bcrypt = require("bcrypt");
const resCode = require("../libs/error");

exports.Ownerinfo = async (req, res, next) => {
  try {
    const myprofile = await Owner.findOne({ where: { id: req.decoded.id } });
    if (!myprofile) {
      const error = resCode.BAD_REQUEST_NO_USER;
      console.error("ERROR RESPONSE -", error);
      return res.status(error.code).json(error);
    } else {
      const response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
      response.data = myprofile;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};
exports.updateOwner = async (req, res, next) => {
  try {
    const { newPassword, currentPassword, ownerPhone } = req.body;

    let passwordEncoding = null;
    // password가 있으면 암호화 시켜야함
    const owner = await Owner.findOne({ where: { id: req.decoded.id } });
    // owner가 없을 때의 예외처리
    if (!owner) {
      const error = resCode.UNAUTHORIZED_ERROR;
      console.error("ERROR RESPONSE -", error);
      return res.status(error.code).json(error);
    } else {
      // 현재 패스워드와 새로운 패스워드가 모두 입력 되었을때 비밀번호 변경에 접근이 가능
      if (newPassword && currentPassword) {
        // 현재 비밀번호와 DB의 비밀번호를 크립토로 비교
        if (!(await bcrypt.compare(currentPassword, owner.password))) {
          const error = resCode.BAD_REQUEST_WRONG_DATA;
          console.log("ERROR RESPONSE -", error);
          return res.status(error.code).json(error);
        }
        // 비교 성공 시에 비밀번호를 암호화하여 넣음
        passwordEncoding = await bcrypt.hash(newPassword, 12);
      }
      if (
        !(await Owner.update(
          {
            password: passwordEncoding ? passwordEncoding : owner.password,
            ownerPhone: ownerPhone ? ownerPhone : owner.ownerPhone,
          },
          {
            where: { id: req.decoded.id },
          }
        ))
      ) {
        const error = resCode.BAD_REQUEST_WRONG_DATA;
        console.error("ERROR RESPONSE -", error);
        return res.status(error.code).json(error);
      } else {
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
exports.withdrawOwner = async (req, res, next) => {
  try {
    const { email } = req.params;
    // 암호화된 코드는 url에 담으면 안됨
    const owner = await Owner.findOne({ where: { email, id: req.decoded.id } });
    if (!owner) {
      const error = resCode.FORBIDDEN_ERROR;
      console.error("ERROR RESPONSE -", error);
      return res.status(error.status).json(error);
    } else {
      if (!(await Owner.destroy({ where: { email, id: req.decoded.id } }))) {
        const error = resCode.BAD_REQUEST_WRONG_DATA;
        console.error("ERROR RESPONSE -", error);
        return res.status(error.code).json(error);
      } else {
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
