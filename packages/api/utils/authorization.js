const jwt = require('jsonwebtoken');

const BEARER = 'Bearer';

// TODO: unauthorized request not showing up
const authorizeRequest = (req, callback) => {
  if (!req.headers.authorization) {
    callback('Token is null', null);
    return
  }
  if (!req.headers.authorization.startsWith(BEARER)) {
    callback('Token does not start with Bearer', null);
    return
  }
  let token = req.headers.authorization.slice(BEARER.length);
  console.log(token)
  let payload;
  try {
    payload = jwt.verify(token, `${process.env.JWT_SECRET}`);
  } catch (err) {
    callback(err, null);
    return
  }

  callback(null, payload.id);
}

module.exports = { authorizeRequest };