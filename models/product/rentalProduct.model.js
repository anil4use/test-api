const mongoose = require("mongoose");
const rentalProductSchema = new mongoose.Schema(
  {
    rentId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      ref: "User",
      trim: true,
    },
    productId: {
      type: String,
      ref: "Product",
      trim: true,
    },
    quantity: {
      type: Number,
      trim: true,
    },
    productOutDate: {
      type: Date,
      default: Date.now,
      trim: true,
    },
    days: {
      type: Number,
      trim: true,
    },
    returnedDate: {
      type: Date,
    },
    weight: {
      type: Number,
      trim: true,
    },
    length: {
      type: Number,
      trim: true,
    },
    width: {
      type: Number,
      trim: true,
    },
    height: {
      type: Number,
      trim: true,
    },
    isReturn: {
      type: Boolean,
      default: false,
    },
    addressId: {
      type: String,
      ref: "Address",
      trim: true,
    },
    shippingCharge: {
      type: Number,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RentalProduct", rentalProductSchema);
