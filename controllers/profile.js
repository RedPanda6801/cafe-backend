const nodemailer = require("nodemailer");
const { Owner } = require("../models");
const bcrypt = require("bcrypt");

exports.Ownerinfo = async (req, res) => {
  try {
    /* passport면 req.body.id token이면 req.decoded.id */
    const myprofile = await Owner.findOne({ where: { id: req.params.email } });
    console.log(myprofile);
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "점주 정보가 없습니다.",
    });
  }
};
exports.editOwner = async (req, res) => {
  try {
    const { provider, password, name, ownerPhone } = req.body;
    const renewOwner = await Owner.update(
      {
        provider,
        password,
        name,
        ownerPhone,
      },
      {
        where: { id: req.params.email },
      }
    );
    console.log(renewOwner);
    if (renewOwner) {
      return res.status(200).json({
        message: "정보 수정 성공",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
exports.withdrawOwner = async (req, res) => {
  try {
    await Owner.destroy({ where: { id: req.body.email } });
    res.status(200).json({
      message: "점주 삭제 성공",
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};
