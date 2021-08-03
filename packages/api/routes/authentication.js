const bcrypt = require('bcryptjs')
var express = require('express')
const jwt = require('jsonwebtoken');
const waterfall = require('async/waterfall');

var router = express.Router();

const crypto = require('crypto');

const User = require('../models/user');
const Verification = require('../models/verification');

const Validation = require('../utils/validation');
const Email = require('../utils/email');
const Errors = require('../utils/errors');

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

router.post('/register', async (req, res) => {
  try {
    // Validate parameters.
    const email = req.body.email;
    const password = req.body.password;
    await Validation.validate([
      Validation.isEmail(email),
      Validation.isPassword(password),
    ]);

    // Check if the user is already registered.
    let user = await User.findOne({ email: email });
    if (user) {
      throw Errors.makeBadRequestError('User already registered');
    }

    // Create the new user.
    user = new User({
      email: email,
      password: bcrypt.hashSync(password, 10),
    });
    await user.save();

    // Create a verification for the user.
    const verification = new Verification({
      user: user._id,
      verificationCode: crypto.randomUUID(),
    });
    verification.save();

    // Send a verification email to the email address provided.
    await Email.sendVerificationEmail(
      user.email,
      verification.verificationCode,
      req.protocol,
      req.get('host')
    );

    // Send a response with the user object.
    res.status(200).send(makeRegisterResponse(user));
  } catch (err) {
    if (err.message || !err.status) {
      res.status(500).send(err);
    }
    if (!err.status) {
      res.status(500).send(err);
      return;
    }
    res.status(err.status).send(err)
  }
});

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
      if (user.active === false) {
        res.status(400).json(makeError('Please verify your email before logging in'))
      }
      res.status(200).json(makeLoginResponse(user, jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`)));
    });
  })
})

router.get("/verify", (req, res) => {
  const verificationCode = req.query.code;
  console.log(verificationCode)
  // query mongo database to get user id associated with code
  Verification.findOne({ verificationCode: verificationCode, }, (err, verificationCode) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    if (!verificationCode) {
      res.status(400).json(makeError('Verification code not found'))
      return
    }
    // otherwise, we have found the userId associated with the code
    User.findOne({ _id: verificationCode.user, }, (err, user) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      if (!user) {
        res.status(400).json(makeError('User not found'))
        return
      }
      user.active = true;
      user.save((err) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send('Your account is now verified');
      });
    })
  })
})

module.exports = router

