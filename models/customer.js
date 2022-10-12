// 지역 DB를 따로 두는 걸로 하자. 조회가 많기 때문
const Sequelize = require("sequelize");

module.exports = class Customer extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        custPhone: {
          type: Sequelize.STRING(13),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Customer",
        tableName: "Customers",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Customer.hasMany(db.Stamp);
  }
};
