const mongoose = require("mongoose");
const rentalProductSchema = new mongoose.Schema(
  {
    barnRentalId: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      ref: "User",
      trim: true,
    },
    barnId: {
      type: String,
      ref: "Barn",
      trim: true,
    },
    boardFacilityName: {
      type: String,
      trim: true,
    },
    boardFacilityAddress: {
      type: String,
      trim: true,
    },
    horseDetail: [
      {
        horseName: {
          type: String,
          trim: true,
        },
        horseBreed: {
          type: String,
          trim: true,
        },
        horseAge: {
          type: Number,
          trim: true,
        },
        images: [
          {
            type: String,
            trim: true,
          },
        ],
        horseDocument: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],

    days: {
      type: Number,
      trim: true,
    },
    price: {
      type: Number,
      trim: true,
    },
    totalPrice: {
      type: Number,
      trim: true,
    },
    isActive: {
      type: Boolean,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RentBarn", rentalProductSchema);
