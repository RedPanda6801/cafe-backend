const resCode = {
  REQUEST_SUCCESS: {
    code: 200,
    message: "Successful Request",
  },
  NO_SEARCH_DATA: {
    code: 204,
    message: "No Search Data",
  },
  BAD_REQUEST_LACK_DATA: {
    code: 400,
    message: "More Data is Required!",
  },
  BAD_REQUEST_NO_USER: {
    code: 400,
    message: "No User",
  },
  BAD_REQUEST_EXIESTED: {
    code: 400,
    message: "Data Already Existed!",
  },
  BAD_REQUEST_WRONG_DATA: {
    code: 400,
    message: "Request Failed",
  },
  FORBIDDEN_ERROR: {
    code: 403,
    message: "Forbidden Error",
  },
  TOKEN_EXPIRED_ERROR: {
    code: 419,
    message: "Token is Expired",
  },
  UNAUTHORIZED_ERROR: {
    code: 401,
    message: "Unauthorized User",
  },
  TYPE_ERROR: {
    code: 500,
  },
  SEQUELIZED_ERROR: {
    code: 500,
  },
  UNEXPECTED_ERROR: {
    code: 500,
  },
  NOT_FOUND: {
    code: 404,
    message: "URL Not Found!",
  },
};

module.exports = resCode;
