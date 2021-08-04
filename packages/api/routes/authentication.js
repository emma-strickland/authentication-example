const bcrypt = require('bcryptjs')
var express = require('express')
const jwt = require('jsonwebtoken');

var router = express.Router();

const crypto = require('crypto');

const User = require('../models/user');
const Verification = require('../models/verification');

const validation = require('../utils/validation');
const sendEmail = require('../utils/email');
const error = require('../utils/error');

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

router.post('/register', async (req, res, next) => {
  try {
    // Validate parameters.
    const email = req.body.email;
    const password = req.body.password;
    await validation.validate([
      validation.isEmail(email),
      validation.isPassword(password),
    ]);

    // Check if the user is already registered.
    let user = await User.findOne({ email: email });
    if (user) {
      throw error.makeBadRequestError('User already registered');
    }

    // Create the new user.
    user = new User({
      email: email,
      password: bcrypt.hashSync(password, 10),
    });
    await user.save();

    // Create a verification for the user.
    // TODO: make sure that verification code is unique
    let verification = new Verification({
      user: user._id,
      verificationCode: crypto.randomUUID(),
    });
    await verification.save();

    // Send a verification email to the email address provided.
    await sendEmail.sendVerificationEmail(
      user.email,
      verification.verificationCode,
      req.protocol,
      req.get('host')
    );

    // Send a response with the user object.
    res.status(200).send(makeRegisterResponse(user));

  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    // Validate parameters.
    const email = req.body.email;
    const password = req.body.password;
    await validation.validate([
      validation.isEmail(email),
      validation.isString('Password', password),
    ]);
    let user = await User.findOne({ email: email });
    if (!user) {
      throw error.makeBadRequestError('User not found');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw error.makeBadRequestError('Invalid password');
    }
    if (user.active === false) {
      throw error.makeBadRequestError('Please verify your email before logging in');
    }
    res.status(200).json(makeLoginResponse(user, jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`)));

  }
  catch (err) {
    next(err);
  }
})

router.get('/verify', async (req, res, next) => {
  try {
    const code = req.query.code;
    console.log(code);

    // query mongo database to get user id associated with code
    let verificationCode = await Verification.findOne({ verificationCode: code })
    if (!verificationCode) {
      throw error.makeBadRequestError('Verification code not found');
    }
    let user = await User.findOne({ _id: verificationCode.user })
    if (!user) {
      throw error.makeBadRequestError('User not found');
    }
    if (user.active === true) {
      throw error.makeBadRequestError('This account is already verified');
    }
    user.active = true;
    await user.save();
    res.status(200).send('Your account is now verified');

  } catch (error) {
    next(error)
  }
})

module.exports = router

