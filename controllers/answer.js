const { Solution } = require("../models");
const { Owner } = require("../models");

const resCode = require("../libs/error");

exports.addanswer = async (req, res, next) => {
  try {
    // 카테고리,제목, 내용
    const { comment } = req.body;

    const newAnswer = await Solution.create({
      comment: comment,
      OwnerId: req.decoded.id,
    });
    const answerData = newAnswer.dataValues;
    // 게시글 생성 확인 예외처리
    if (!answernData || answerData === {}) {
      const error = resCode.BAD_REQEST_WRONG_DATA;
      return res.status(error.code).json(error);
    } else {
      const response = resCode.REQEST_SUCCESS;
      response.answer = answerData;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.answerinfo = async (req, res, next) => {
  try {
    const OwnerId = req.decoded.id;
    const myanswers = await Answer.findAll({
      where: { OwnerId },
    });
    // 질문 확인
    if (myanswers === []) {
      response = resCode.NO_SEARCH_DATA;
    } else {
      response = resCode.REQEST_SUCCESS;
    }
    response.data = myanswers;
    return res.status(response.code).json(response);
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.updateanswer = async (req, res, next) => {
  try {
    // 수정할 값은 하나만 들어와도 수정되어야 한다.
    const { comment } = req.body;
    const { answerId } = req.params;
    const answer = await Answer.findOne({
      where: { id: answerId, OwnerId: req.decoded.id },
    });

    if (!answer) {
      const response = resCode.NO_SEARCH_DATA;
      console.log(response.message);
      return res.status(response.code).json(response);
    } else {
      await Answer.update(
        {
          comment: comment ? comment : answer.comment,
        },
        {
          where: { id: answerId },
        }
      );
      const response = resCode.REQEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

// 여기부터 내일 해야함
exports.removeanswer = async (req, res, next) => {
  try {
    const { answerId } = req.params;
    const answer = await Answer.findOne({
      where: { id: answerId, OwnerId: req.decoded.id },
    });
    console.log(answer);
    if (answer.id) {
      await Answer.destroy({ where: { id: answerId } });
      const response = resCode.REQEST_SUCCESS;
      return res.status(response.code).json(response);
    } else {
      const error = resCode.BAD_REQEST_WRONG_DATA;
      return res.status(error.code).json(error);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};
