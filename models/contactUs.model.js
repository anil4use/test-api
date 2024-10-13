const mongoose = require("mongoose");
const contactUsSchema = new mongoose.Schema(
  {
    enquiryId: {
      type: String,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    query: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ContactUs", contactUsSchema);
