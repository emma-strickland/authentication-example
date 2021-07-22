const VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const MIN_PASSWORD_LENGTH = 8;

function isString(name, str) {
  if (!str) {
    return `${name} is required`;
  }
  if (typeof str !== 'string' && !(str instanceof String)) {
    return `${name} must be a String`;
  }
  return null;
}

function isNumber(name, number) {
  // TODO
}

function isEmail(email) {
  let isStringError = isString('Email', email);
  if (isStringError) {
    return isStringError;
  }
  if (!email.match(VALID_EMAIL_REGEX)) {
    return `Invalid email`;
  }
  return null;
}

function isPassword(password) {
  let isStringError = isString('Password', password);
  if (isStringError) {
    return isStringError;
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }
  return null;
}

function validate(validationErrors, callback) {
  for (error of validationErrors) {
    if (error) {
      callback(error);
      return;
    }
  }
  callback();
}

module.exports = { isString, isPassword, isEmail, validate };