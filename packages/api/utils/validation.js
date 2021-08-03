const Errors = require('./errors');

const VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const MIN_PASSWORD_LENGTH = 8;
const CATEGORIES = ["SOFA", "CHAIR", "TABLE", "DESK", "LIGHTNING", "RUG"];
const BOROUGHS = ["BROOKLYN", "BRONX", "MANHATTAN", "STATEN_ISLAND", "QUEENS"];


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
  if (!number) {
    return `${name} is required`;
  }
  if (isNaN(number)) {
    return `${name} must be a number`
  }
  return null;
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

function isCategory(category) {
  let isStringError = isString('Category', category);
  if (isStringError) {
    return isStringError;
  }
  if (!CATEGORIES.includes(category)) {
    return `Invalid category`;
  }
  return null;
}

function isBorough(borough) {
  let isStringError = isString('Borough', borough);
  if (isStringError) {
    return isStringError;
  }
  if (!BOROUGHS.includes(borough)) {
    return `Invalid borough`;
  }
  return null;
}

function validate(validationErrors) {
  return new Promise((resolve, reject) => {
    for (error of validationErrors) {
      if (error) {
        reject(Errors.makeBadRequestError(error));
        return;
      }
    }
    resolve();
  })
}

module.exports = { isString, isNumber, isPassword, isEmail, isCategory, isBorough, validate };