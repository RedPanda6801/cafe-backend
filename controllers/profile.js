const nodemailer = require("nodemailer");
const { Owner } = require("../models");
const bcrypt = require("bcrypt");

exports.Ownerinfo = async (req, res) => {
  try { /* passport면 req.body.id token이면 req.decoded.id */
    const myprofile = await Owner.findOne({ where : { id : req.params.email}})
    console.log(myprofile);
  }
}
