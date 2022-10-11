const { Owner } = require("../models");
const bcrypt = require("bcrypt");

exports.Ownerinfo = async (req, res) => {
  try {
    const myprofile = await Owner.findOne({ where: { id: req.decoded.id } });
    console.log(myprofile);
    if (myprofile) {
      return res.status(200).json({
        message: "Profile Success",
        user: myprofile,
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
exports.updateOwner = async (req, res) => {
  try {
    const { password, ownerPhone } = req.body;
    const passwordEncoding = "";
    if (password) passwordEncoding = await bcrypt.hash(password, 12);
    const owner = await Owner.findOne({ where: { id: req.decoded.id } });
    if (owner) {
      const renewOwner = await Owner.update(
        {
          password: passwordEncoding ? passwordEncoding : owner.password,
          ownerPhone: ownerPhone ? ownerPhone : owner.ownerPhone,
        },
        {
          where: { id: req.decoded.id },
        }
      );
      if (renewOwner) {
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
exports.withdrawOwner = async (req, res) => {
  try {
    // body에 담아도 된다면 바디로 수정
    const { email, password } = req.params;
    const owner = await Owner.findOne({ where: { email } });
    if (owner.id === req.decoded.id) {
      const auth = await bcrypt.compare(password, owner.password);
      if (auth) {
        await Owner.destroy({ where: { email } });
        res.status(200).json({
          message: "점주 삭제 성공",
        });
      } else {
        console.log("password error");
        res.status(400).json({
          message: "Password Error",
        });
      }
    } else {
      console.log("Forbidden Error");
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
