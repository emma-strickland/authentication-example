function makeError(code, message) {
  return {
    status: code,
    errorMessage: message
  };
}

function makeServerError(message) {
  return makeError(500, message);
}

function makeBadRequestError(message) {
  return makeError(400, message);
}

module.exports = { makeBadRequestError };