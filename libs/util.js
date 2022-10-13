const nodemailer = require("nodemailer");

exports.getAuthCode = () => {
  const arr = [];

  while (arr.length < 6) {
    const element = Math.floor(Math.random() * 123);
    if (element > 47 && element < 58) arr.push(element);
    else if (element > 64 && element < 91) arr.push(element);
  }

  return String.fromCharCode(...arr);
};

exports.getTempPassword = () => {
  const arr = [];

  while (arr.length < 8) {
    const element = Math.floor(Math.random() * 123);
    if (element > 47 && element < 58) arr.push(element);
    else if (element > 96 && element < 123) arr.push(element);
  }

  return String.fromCharCode(...arr);
};

exports.getExpireDate = (month) => {
  let date = new Date();
  let addMonth = date.getMonth() + month;
  if (addMonth > 11) {
    date.setFullYear(date.getFullYear() + 1);
    addMonth -= 12;
  }
  const newDate = new Date(date.setMonth(addMonth + 1));
  return newDate;
};

exports.makeEmail = (html, subject, email) => {
  let transporter = nodemailer.createTransport({
    service: "Naver",
    host: "smtp.naver.com",
    port: 465,
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  });

  let mailOption = {
    from: process.env.EMAIL,
    to: email, // list of receivers
    subject, // Subject line
    html, // html body
  };
  // LocalStorage에 저장하되, 암호화하여 저장 -> 코드 인증 시에 복호화하여 비교
  return [transporter, mailOption];
};
