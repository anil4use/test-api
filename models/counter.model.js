const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    seq: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Counter", counterSchema);
