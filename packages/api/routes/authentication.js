const bcrypt = require('bcryptjs')
var express = require('express')
const jwt = require('jsonwebtoken');
var router = express.Router();

const User = require('../models/user');

const Validation = require('../utils/validation');

// TODO: move functions to another file in utils
const makeError = (str) => {
  return {
    message: str
  }
}

const makeRegisterResponse = (user) => {
  return {
    user: user
  }
}

const makeLoginResponse = (user, token) => {
  return {
    user: user,
    token: token
  }
}

router.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  Validation.validate([
    Validation.isEmail(email),
    Validation.isPassword(password),
    Validation.isString("First name", firstName),
    Validation.isString("Last name", lastName),
  ], err => {
    if (err) {
      res.status(400).json(makeError(err));
      return;
    }
    User.findOne({ email: email, }, (err, user) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      if (user) {
        res.status(400).json(makeError('Already registered'))
        return
      }
      const userDocument = new User({
        email: email,
        password: bcrypt.hashSync(password, 10),
        firstName: firstName,
        lastName: lastName
      });
      userDocument.save((err, result) => {
        if (err) {
          res.status(500).json(err);
          return;
        }
        res.status(200).json(makeRegisterResponse(result));
      });
    });
  })
})

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Validation.validate([
    Validation.isEmail(email),
    Validation.isString('Password', password),
  ], err => {
    if (err) {
      res.status(400).json(makeError(err))
      return;
    }
    User.findOne({ email: email, }, (err, user) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      if (!user) {
        res.status(400).json(makeError('User not found'))
        return
      }
      if (!bcrypt.compareSync(password, user.password)) {
        res.status(401).json(makeError('Invalid password'))
        return
      }
      res.status(200).json(makeLoginResponse(user, jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`)));
    });
  })
})

module.exports = router

