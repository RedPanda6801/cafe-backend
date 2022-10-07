// 지역 DB를 따로 두는 걸로 하자. 조회가 많기 때문
const Sequelize = require("sequelize");

module.exports = class Stamp extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        count: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Stamp",
        tableName: "Stamps",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Stamp.belongsTo(db.Cafe);
    db.Stamp.belongsTo(db.Customer);
  }
};
