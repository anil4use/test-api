const mongoose = require("mongoose");
const Cart = new mongoose.Schema(
  {
    cartId: {
      type: String,
      trim: true,
      required: true,
    },
    userId: {
      type: String,
      trim: true,
      required: true,
    },
    item: [
      {
        productId: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          trim: true,
        },
      },
    ],
    shippingInfo: {
      zipCode: {
        type: String,
        trim: true,
      },
      street: {
        type: String,
        trim: true,
      },
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
      contact: {
        type: Number,
        trim: true,
      },
    },
    status: {
      type: String,
      default: "Pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isCouponApplied: {
      type: Boolean,
      default: false,
    },
    couponId: {
      type: String,
      trim: true,
    },
    totalShippingCharge: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", Cart);
