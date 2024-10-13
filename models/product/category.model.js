const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
  {
    categoryId: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      trim: true,
      default: "pending",
    },
    createdBy: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", categorySchema);
