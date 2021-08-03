const bcrypt = require('bcryptjs')
var express = require('express')
const jwt = require('jsonwebtoken');
var router = express.Router();

const crypto = require('crypto');

const User = require('../models/user');
const Verification = require('../models/verification');

const Validation = require('../utils/validation');
const Email = require('../utils/email');

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

  Validation.validate([
    Validation.isEmail(email),
    Validation.isPassword(password),
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
      });
      userDocument.save((err, userDocumentResult) => {
        if (err) {
          res.status(500).json(err);
          return;
        }
        // TODO: verificationCode should be unique
        // const code = crypto.randomUUID(),
        const verificationDocument = new Verification({
          user: userDocumentResult._id,
          verificationCode: crypto.randomUUID(),
        });
        verificationDocument.save((err, verificationDocumentResult) => {
          if (err) {
            res.status(500).json(err);
            return;
          }
          Email.sendVerificationEmail(userDocument.email, verificationDocumentResult.verificationCode, (err) => {
            if (err) {
              res.status(500).json(err);
              return;
            }
            res.status(200).json(makeRegisterResponse(userDocumentResult));
          })
        });
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
      if (user.active === false) {
        res.status(400).json(makeError('Please verify your email before logging in'))
      }
      res.status(200).json(makeLoginResponse(user, jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`)));
    });
  })
})

// https://localhost:3000/authentication/verify?code=123
// req.query.code => 123

// how do i parse out the code and place it in the url here? 
router.route("/verify/:token")
  .get((req, res) => {
    const code = req.params.verificationCode;
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

// next steps are to get the button in the sendgrid email to work and go to a server link with the query parameters
// in the url 

module.exports = router

