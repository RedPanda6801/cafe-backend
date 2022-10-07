// 지역 DB를 따로 두는 걸로 하자. 조회가 많기 때문
const Sequelize = require("sequelize");

module.exports = class Cafe extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        cafeName: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        businessNum: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        expireDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Cafe",
        tableName: "Cafes",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Cafe.hasMany(db.Customer);
    db.Cafe.belongsTo(db.Owner);
  }
};
