const { Owner, Solution, Question } = require("../models");

const resCode = require("../libs/error");

exports.addanswer = async (req, res, next) => {
  try {
    // 카테고리,제목, 내용
    const { comment } = req.body;
    const { questionId } = req.params;
    const user = await Owner.findOne({ where: { id: req.decoded.id } });
    if (user) {
      if (user.isManager) {
        if (!(await Question.findOne({ where: { id: questionId } }))) {
          const error = resCode.BAD_REQUEST_WRONG_DATA;
          console.error("No Question");
          return res.status(error.code).json(error);
        }
        const answerData = await Solution.create({
          comment,
          OwnerId: user.id,
          QuestionId: questionId,
        });
        const response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
        response.answer = answerData;
        return res.status(response.code).json(response);
      } else {
        const error = resCode.FORBIDDEN_ERROR;
        console.error("Forbidden Error");
        return res.status(error.code).json(error);
      }
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error);
    error.statusCode = 500;
    next(error);
  }
};

exports.answerinfo = async (req, res, next) => {
  try {
    const myanswers = await Solution.findAll({
      where: { OwnerId: req.decoded.id },
    });
    // 질문 확인
    if (myanswers === []) {
      response = JSON.parse(JSON.stringify(resCode.NO_SEARCH_DATA));
    } else {
      response = JSON.parse(JSON.stringify(resCode.REQUEST_SUCCESS));
    }
    response.data = myanswers;
    return res.status(response.code).json(response);
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};

exports.updateanswer = async (req, res, next) => {
  try {
    // 수정할 값은 하나만 들어와도 수정되어야 한다.
    const { comment } = req.body;
    const { solutionId } = req.params;
    const answer = await Solution.findOne({
      where: { OwnerId: req.decoded.id, QuestionId: solutionId },
    });
    if (!answer) {
      const error = resCode.BAD_REQUEST_WRONG_DATA;
      console.log(error.message);
      return res.status(error.code).json(error);
    } else {
      await Solution.update(
        {
          comment: comment ? comment : answer.comment,
        },
        {
          where: { OwnerId: req.decoded.id },
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
exports.removeanswer = async (req, res, next) => {
  try {
    const { solutionId } = req.params;
    const answer = await Solution.findOne({
      where: { id: solutionId, OwnerId: req.decoded.id },
    });
    if (answer) {
      await Solution.destroy({ where: { id: solutionId } });
      const response = resCode.REQUEST_SUCCESS;
      return res.status(response.code).json(response);
    } else {
      const error = resCode.BAD_REQUEST_WRONG_DATA;
      console.error(error.message);
      return res.status(error.code).json(error);
    }
  } catch (error) {
    console.error("ERROR RESPONSE -", error.name);
    error.statusCode = 500;
    next(error);
  }
};
