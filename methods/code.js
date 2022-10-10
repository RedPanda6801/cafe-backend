exports.getAuthCode = () => {
  const arr = [];

  while (arr.length < 6) {
    const element = Math.floor(Math.random() * 123);
    if (element > 47 && element < 58) arr.push(element);
    else if (element > 64 && element < 91) arr.push(element);
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
