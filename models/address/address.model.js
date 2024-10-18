const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
  {
    addressId: {
      type: String,
      trim: true,
    },
    userId: {
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
    email: {
      type: String,
      trim: true,
    },
    contact: {
      type: Number,
      trim: true,
    },
    zipCode: {
      type: Number,
      trim: true,
    },
    street: {
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
    stateOrProvinceCode:{
      type: String,
      trim: true,
    },
    country:{
        type: String,
        trim: true,
    },
    IsActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Address", addressSchema);
