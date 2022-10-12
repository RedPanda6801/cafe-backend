const { verifyToken } = require("../middlewares/middleware");
const { Customer } = require("../models");

exports.registercustomer = async (req, res) => {
  try {
    const { custPhone } = req.body;
    const newcustomer = await Customer.findOne({ where: { custPhone } });
    if (!newcustomer) {
      const join = await Customer.create({
        custPhone,
      });
      if (join) {
        return res.status(200).json({
          message: "Customer Resister Success",
        });
      } else if (custPhone.length !== 11) {
        return res.status(400).json({
          message: "Wrong Digit Number",
        });
      } else {
        return res.status(400).json({
          message: "Failed",
        });
      }
    } else {
      return res.status(403).json({
        message: "Aleady Existed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "Not Found",
    });
  }
};

exports.customerinfo = async (req, res) => {
  try {
    const customerprofile = await Customer.findOne({
      where: { id: req.decoded.id },
    });
    console.log(customerprofile);
    if (customerprofile) {
      return res.status(200).json({
        message: "CUstomer Profile Success",
        customer: customerprofile,
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
