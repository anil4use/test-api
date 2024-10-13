const mongoose = require("mongoose");
const adsSectionSchema = new mongoose.Schema({
  adsSectionId: {
    type: String,
    trim: true,
  },
  heading: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
    enum: ["single", "multiple"],
  },
  isActive: {
    type: Boolean,
    trim: true,
  },
});

module.exports = mongoose.model("AdsSection", adsSectionSchema);
