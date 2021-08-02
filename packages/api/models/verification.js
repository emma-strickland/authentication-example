const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  verificationCode: {
    type: String,
    required: true,
    unique: true,
  },
});

const Verification = mongoose.model("Verification", VerificationSchema);

module.exports = Verification;
