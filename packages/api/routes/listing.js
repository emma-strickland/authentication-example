var express = require('express')
var router = express.Router();

const User = require('../models/user');
const Listing = require('../models/listing');

const validation = require('../utils/validation');
const authorization = require('../utils/authorization');

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

router.post('/post', async (req, res, next) => {
  try {
    // Validate parameters.
    const title = req.body.title;
    const category = req.body.category;
    const description = req.body.description;
    const borough = req.body.borough;
    const price = req.body.price;
    await validation.validate([
      validation.isBorough(borough),
      validation.isCategory(category),
      validation.isString('Title', title),
      validation.isString('Description', description),
      validation.isNumber('Price', price),
    ]);

    // Authorize the user.
    let user = await authorization.authorizeRequest(req)

    // Create listing.
    const postDocument = new Listing({
      user: user._id,
      title: title,
      category: category,
      description: description,
      borough: borough,
      price: price,
    });
    await postDocument.save()

    res.status(200).json(makePostResponse(postDocument));

  } catch (error) {
    next(error)
  }
});

// router.post('/post', async (req, res, next) => {
//   const id = req.body.title;
//   const title = req.body.title;
//   const category = req.body.category;
//   const description = req.body.description;
//   const borough = req.body.borough;
//   const price = req.body.price;

//   Validation.validate([
//     Validation.isBorough(borough),
//     Validation.isCategory(category),
//     Validation.isString('Title', title),
//     Validation.isString('Description', description),
//     Validation.isNumber('Price', price),
//   ], err => {
//     if (err) {
//       res.status(400).json(makeError(err))
//       return;
//     }
//     authorization.authorizeRequest(req, (err, userId) => {
//       if (err) {
//         res.status(401).json(err);
//         return
//       }
//       console.log('userId: ', userId);
//       User.findOne({ _id: userId }, (err, user) => {
//         if (err) {
//           res.status(500).json(err);
//           return;
//         }
//         if (!user) {
//           res.status(400).json(makeError('User not found'))
//           return
//         }
//         const postDocument = new Listing({
//           email: 'fake@gmail.com',
//           title: title,
//           category: category,
//           description: description,
//           borough: borough,
//           price: price,
//         });
//         postDocument.save((err, result) => {
//           if (err) {
//             res.status(500).json(err);
//             return;
//           }
//           res.status(200).json(makePostResponse(result));
//         });
//       });
//     });
//   });
// })

router.get('/browse', async (_, res, next) => {
  try {
    // Search database for all listings. 
    let listings = await Listing.find({})
    if (!listings) {
      throw error.makeBadRequestError('No listings not found');
    }
    res.status(200).json(makeBrowseResponse(listings));

  } catch (error) {
    next(error)
  }
})

// router.get('/browse', (_, res) => {
//   Listing.find({}, (err, listings) => {
//     if (err) {
//       res.status(500).json(err);
//       return;
//     }
//     if (!listings) {
//       res.status(400).json(makeError('No listings not found'))
//       return
//     }
//     res.status(200).json(makeBrowseResponse(listings));
//   })
// })

module.exports = router
