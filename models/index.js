const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const Owner = require("./owner");
const Cafe = require("./cafe");
const Customer = require("./customer");
const Question = require("./question");
const Stamp = require("./stamp");
const Solution = require("./solution");

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Owner = Owner;
db.Cafe = Cafe;
db.Customer = Customer;
db.Question = Question;
db.Stamp = Stamp;
db.Solution = Solution;

Owner.init(sequelize);
Cafe.init(sequelize);
Customer.init(sequelize);
Question.init(sequelize);
Stamp.init(sequelize);
Solution.init(sequelize);

Owner.associate(db);
Cafe.associate(db);
Customer.associate(db);
Question.associate(db);
Stamp.associate(db);
Solution.associate(db);

module.exports = db;
