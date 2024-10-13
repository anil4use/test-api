const mongoose = require("mongoose");
const serviceReviewSchema = new mongoose.Schema(
  {
    serviceId: {
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
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("ServiceReview",serviceReviewSchema);