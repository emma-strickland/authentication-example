var express = require('express')
var router = express.Router();

const User = require('../models/user');
const Listing = require('../models/listing');

const validation = require('../utils/validation');
const authorization = require('../utils/authorization');
const error = require('../utils/error');

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

const makeDeleteResponse = () => {
  return {};
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
    console.log('User: ', user);
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

router.post('/delete', async (req, res, next) => {
  try {
    // Validate parameters.
    const listingId = req.body.listing;
    await validation.validate([
      validation.isString('Listing ID', listingId),
    ]);

    // Authorize the user.
    const user = await authorization.authorizeRequest(req)

    // Find the listing by id.
    let listing = await Listing.findOne({ _id: listingId });
    if (!listing) {
      throw error.makeBadRequestError('Listing does not exist');
    }

    // Make sure the listing belongs to the user.
    if (!listing.user._id.equals(user._id)) {
      throw error.makeBadRequestError('You do not have permission to delete this listing');
    }

    // Remove the listing from the database.
    await Listing.deleteOne({ _id: listingId });
    res.status(200).json(makeDeleteResponse());

  } catch (error) {
    next(error)
  }
})

module.exports = router
