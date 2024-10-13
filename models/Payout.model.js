// models/Payout.js
const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      trim: true,
      required: true,
    },
    vendorId: {
      type: String,
      trim: true,
      required: true,
    },
    vendorType: {
      type: String,
      enum: ["barnOwner", "serviceProvider", "rentalProduct"],
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    payoutDate: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payout", payoutSchema);
