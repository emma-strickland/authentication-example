const jwt = require('jsonwebtoken');

const User = require('../models/user');
const errors = require('./error');

const BEARER = 'Bearer';

// since function is async there's no need for Promise inside of function - async function always return a Promise anyway
async function authorizeRequest(req) {
  return new Promise(async (resolve, reject) => {
    if (!req.headers.authorization) {
      reject(errors.makeBadRequestError('Token is null'));
      return;
    }
    if (!req.headers.authorization.startsWith(BEARER)) {
      reject(errors.makeBadRequestError('Token does not start with Bearer'));
      return;
    }
    let token = req.headers.authorization.slice(BEARER.length);
    console.log(token)
    let payload;
    try {
      payload = jwt.verify(token, `${process.env.JWT_SECRET}`);
    } catch (err) {
      reject(errors.makeBadRequestError('This token was not signed from this server'));
      return
    }
    // If token is authorized, search user in database. 
    // TODO: do we need to use await here?    
    let user = await User.findOne({ _id: payload.id })
    if (!user) {
      reject(errors.makeBadRequestError('User not found'));
      return;
    }
    resolve(user);
  })
}

// User.findOne({ _id: payload.id }, (err, user) => {
//   if (err) {
//     reject(errors.makeInternalServerError(err));
//     return;
//   }
//   if (!user) {
//     reject(error.makeBadRequestError('User not found'));
//     return;
//   }
//   resolve(user);
// })


//   if (!req.headers.authorization) {
//     callback('Token is null', null);
//     return
//   }
//   if (!req.headers.authorization.startsWith(BEARER)) {
//     callback('Token does not start with Bearer', null);
//     return
//   }
//   let token = req.headers.authorization.slice(BEARER.length);
//   console.log(token)
//   let payload;
//   try {
//     payload = jwt.verify(token, `${process.env.JWT_SECRET}`);
//   } catch (err) {
//     callback(err, null);
//     return
//   }

//   callback(null, payload.id);


module.exports = { authorizeRequest };