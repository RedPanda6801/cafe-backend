const { Question } = require("../models");
const { Owner } = require("../models");

const resCode = require("../libs/error");

exports.addquestion = async (req, res, next) => {
  try {
    // 카테고리,제목, 내용
    const { category, title, text } = req.body;

    const newQuesiton = await Question.create({
      category: category,
      title: title,
      text: text,
      OwnerId: req.decoded.id,
    });
    const questionData = newQuesiton.dataValues;
    // 게시글 생성 확인 예외처리
    if (!questionData || questionData === {}) {
      const error = resCode.BAD_REQEST_WRONG_DATA;
      return res.status(error.code).json(error);
    } else {
      const response = resCode.REQEST_SUCCESS;
      response.question = questionData;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.questioninfo = async (req, res, next) => {
  try {
    const OwnerId = req.decoded.id;
    const myquestions = await Question.findAll({
      where: { OwnerId },
    });
    // 질문 확인
    if (myquestions === []) {
      response = resCode.NO_SEARCH_DATA;
    } else {
      response = resCode.REQEST_SUCCESS;
    }
    response.data = myquestions;
    return res.status(response.code).json(response);
  } catch (error) {
    console.error("ERROR :", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.updatequestion = async (req, res, next) => {
  try {
    // 수정할 값은 하나만 들어와도 수정되어야 한다.
    const { category, title, text } = req.body;
    const { questionId } = req.params;
    const question = await Question.findOne({
      where: { id: questionId, OwnerId: req.decoded.id },
    });

    if (!question) {
      const response = resCode.NO_SEARCH_DATA;
      console.log(response.message);
      return res.status(response.code).json(response);
    } else {
      await Question.update(
        {
          category: category ? category : question.category,
          title: title ? title : question.title,
          text: text ? text : question.text,
        },
        {
          where: { id: questionId },
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
exports.removequestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findOne({
      where: { id: questionId, OwnerId: req.decoded.id },
    });
    console.log(question);
    if (question.id) {
      await Question.destroy({ where: { id: questionId } });
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