var express = require('express')
var router = express.Router();

const User = require('../models/user');
const Listing = require('../models/listing');

const Validation = require('../utils/validation');
const Authorization = require('../utils/authorization');

const makeError = (str) => {
  return {
    message: str
  }
}

const makePostResponse = (post) => {
  return {
    post: post
  }
}

const makeBrowseResponse = (listings) => {
  return {
    listings: listings
  }
}

router.post('/post', (req, res) => {
  const id = req.body.title;
  const title = req.body.title;
  const category = req.body.category;
  const description = req.body.description;
  const borough = req.body.borough;
  const price = req.body.price;

  Validation.validate([
    Validation.isBorough(borough),
    Validation.isCategory(category),
    Validation.isString('Title', title),
    Validation.isString('Description', description),
    Validation.isNumber('Price', price),
  ], err => {
    if (err) {
      res.status(400).json(makeError(err))
      return;
    }
    Authorization.authorizeRequest(req, (err, userId) => {
      if (err) {
        res.status(401).json(err);
        return
      }
      console.log('userId: ', userId);
      User.findOne({ _id: userId }, (err, user) => {
        if (err) {
          res.status(500).json(err);
          return;
        }
        if (!user) {
          res.status(400).json(makeError('User not found'))
          return
        }
        const postDocument = new Listing({
          email: 'fake@gmail.com',
          title: title,
          category: category,
          description: description,
          borough: borough,
          price: price,
        });
        postDocument.save((err, result) => {
          if (err) {
            res.status(500).json(err);
            return;
          }
          res.status(200).json(makePostResponse(result));
        });
      });
    });
  });
})

router.get('/browse', (_, res) => {
  Listing.find({}, (err, listings) => {
    console.log(listings)
    if (err) {
      res.status(500).json(err);
      return;
    }
    if (!listings) {
      res.status(400).json(makeError('No listings not found'))
      return
    }
    res.status(200).json(makeBrowseResponse(listings));
  })
})

module.exports = router
