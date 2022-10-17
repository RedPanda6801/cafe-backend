const { Question } = require("../models");
const { Owner } = require("../models");

const resCode = require("../libs/error");

exports.addquestion = async (req, res, next) => {
  try {
    // 카테고리,제목, 내용
    const { category, title, text } = req.body;
    if (!category || !title || !text) {
      const error = resCode.BAD_REQUEST_LACK_DATA;
      console.error(error.message);
      return res.status(error.code).json(error);
    } else {
      const questionData = await Question.create({
        category: category,
        title: title,
        text: text,
        OwnerId: req.decoded.id,
      });
      const response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
      response.question = questionData;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
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
      response = JSON.parse(JSON.stringify(resCode.NO_SEARCH_DATA));
    } else {
      response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
    }
    response.data = myquestions;
    return res.status(response.code).json(response);
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
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
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};

exports.removequestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    if (
      !(await Question.findOne({
        where: { id: questionId, OwnerId: req.decoded.id },
      }))
    ) {
      const error = resCode.BAD_REQUEST_WRONG_DATA;
      console.error(error.message);
      return res.status(error.code).json(error);
    } else {
      await Question.destroy({ where: { id: questionId } });
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};
