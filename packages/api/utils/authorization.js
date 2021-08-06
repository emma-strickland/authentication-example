const jwt = require('jsonwebtoken');

const User = require('../models/user');
const error = require('./error');

const BEARER = 'Bearer';

const authorizeRequest = async (req) => {
  if (!req.headers.authorization) {
    throw error.makeBadRequestError('Token is null');
  }
  if (!req.headers.authorization.startsWith(BEARER)) {
    throw error.makeBadRequestError('Token does not start with Bearer');
  }

  let token = req.headers.authorization.slice(BEARER.length);
  let payload;
  try {
    payload = jwt.verify(token, `${process.env.JWT_SECRET}`);
  } catch (err) {
    throw error.makeBadRequestError('This token was not signed from this server');
  }

  let user = await User.findOne({ _id: payload.id })
  if (!user) {
    throw error.makeBadRequestError('User not found');
  }

  return user;
};

module.exports = { authorizeRequest };