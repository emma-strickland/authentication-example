const mongoose = require("mongoose");

const SellSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

const Sell = mongoose.model("Sell", SellSchema);

module.exports = Sell;