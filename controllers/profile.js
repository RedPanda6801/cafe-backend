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
    const { password, ownerPhone } = req.body;
    let passwordEncoding = "";
    // password가 있으면 암호화 시켜야함
    if (password) passwordEncoding = await bcrypt.hash(password, 12);
    const owner = await Owner.findOne({ where: { id: req.decoded.id } });
    if (!owner) {
      const error = resCode.UNAUTHORIZED_ERROR;
      console.error("ERROR RESPONSE -", error);
      return res.status(error.code).json(error);
    } else {
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
    const { email, password } = req.params;

    const owner = await Owner.findOne({ where: { email, id: req.decoded.id } });
    if (!owner) {
      const error = resCode.FORBIDDEN_ERROR;
      console.error("ERROR RESPONSE -", error);
      return res.status(error.status).json(error);
    } else {
      if (!(await bcrypt.compare(password, owner.password))) {
        const error = JSON.parse(
          JSON.stringify(resCode.BAD_REQUEST_WRONG_DATA)
        );
        error.message = "Password Error";
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
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};
