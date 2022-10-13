const resCode = {
  REQEST_SUCCESS: {
    code: 200,
    message: "Successful Request",
  },
  NO_SEARCH_DATA: {
    code: 204,
    message: "No Search Data",
  },
  BAD_REQEST_LACK_DATA: {
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
  BAD_REQEST_WRONG_DATA: {
    code: 400,
    message: "Request Failed",
  },
  FORBIDDEN_ERROR: {
    code: 401,
  },
  TOKEN_EXPIRED_ERROR: {
    code: 419,
  },
  UNAUTHORIZED_ERROR: {
    code: 403,
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
