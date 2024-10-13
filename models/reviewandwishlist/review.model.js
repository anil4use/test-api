const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      trim: true,
    },
    review: [
      {
        userId: {
          type: String,
          trim: true,
        },
        rating: {
          type: Number,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Review", reviewSchema);
