// 지역 DB를 따로 두는 걸로 하자. 조회가 많기 때문
const Sequelize = require("sequelize");

module.exports = class Question extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        category: {
          type: Sequelize.ENUM(
            "가입 / 인증",
            "로그인 / 정보",
            "결제 문의",
            "결제 수단",
            "프로모션 / 이벤트",
            "웹 이용 문의"
          ),
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        text: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Qustion",
        tableName: "Qustions",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Question.belongsTo(db.Owner);
  }
};
