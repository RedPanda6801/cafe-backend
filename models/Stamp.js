// 지역 DB를 따로 두는 걸로 하자. 조회가 많기 때문
const Sequelize = require("sequelize");

module.exports = class Stamp extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        stackStamp: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        leftStamp: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        visit: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        memo: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Stamp",
        tableName: "Stamps",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Stamp.belongsTo(db.Cafe);
    db.Stamp.hasMany(db.Customer, {
      foreignKey: "custPhone",
      targetKey: "custPhone",
    });
  }
};
