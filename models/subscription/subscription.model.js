const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema(
  {
    subsnId: {
      type: String,
      required: true,
      trim: true,
    },
    planName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    monthlyPrice: {
      type: Number,
      trim: true,
    },
    yearlyPrice: {
      type: Number,
      trim: true,
    },
    isDiscount: {
      type: Boolean,
      trim: true,
    },
    discountPrice: {
      type: Number,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
