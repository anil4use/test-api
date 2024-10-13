const mongoose = require("mongoose");
const rentalServiceSchema = new mongoose.Schema(
  {
    serviceRentId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      ref: "User",
      trim: true,
    },
    serviceId: {
      type: String,
      ref: "Service",
      trim: true,
    },
    serviceStartDate: {
      type: Date,
      default: Date.now,
      trim: true,
    },
    days: {
      type: Number,
      trim: true,
    },
    addressId:{
      type: String,
      ref: "Address",
      trim: true,
    },
    shippingCharge:{
      type: Number,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RentalService", rentalServiceSchema);
