const mongoose = require("mongoose");

// TODO: change everything "post" -> "listing"
const ListingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;