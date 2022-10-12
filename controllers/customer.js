// const { Customer, Stamp, Cafe } = require("../models");

// exports.customerinfo = async (req, res) => {
//   try {
//     const customerprofile = await Customer.findOne({
//       where: { id: req.decoded.id },
//     });
//     console.log(customerprofile);
//     if (customerprofile) {
//       return res.status(200).json({
//         message: "Customer Profile Success",
//         customer: customerprofile,
//       });
//     } else {
//       return res.status(403).json({
//         message: "Forbidden",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(404).json({
//       message: "Not Found",
//     });
//   }
// };
