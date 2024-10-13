const mongoose = require("mongoose");
const walletSchema = new mongoose.Schema(
  {
    vendorId: {
      type: String,
      trim: true,
      required: true,
    },
    vendorType: {
      type: String,
      enum: ["barnOwner", "serviceProvider", "rentalProduct"],
    },
    balance: {
      type: Number,
      default: 0,
    },
    credits: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    debits: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wallet", walletSchema);
