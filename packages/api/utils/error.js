function makeError(code, message) {
  return {
    status: code,
    message: message
  };
}

function makeBadRequestError(message) {
  return makeError(400, message);
}

function makeInternalServerError(message) {
  return makeError(500, message);
}

module.exports = { makeBadRequestError, makeInternalServerError };