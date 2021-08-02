const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
  // TODO: this should be "user"
  email: {
    type: String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  borough: {
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