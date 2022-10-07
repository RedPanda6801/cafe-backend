// 지역 DB를 따로 두는 걸로 하자. 조회가 많기 때문
const Sequelize = require("sequelize");

module.exports = class Owner extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        userId: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        ownerPhone: {
          type: Sequelize.STRING(13),
          allowNull: false,
        },
        isManager: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Onwer",
        tableName: "Owners",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  // static associate(db) {

  // }
};