const mongoose = require("mongoose");
const jobCategorySchema = mongoose.Schema(
  {
    jobCategoryId: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
      required: true,
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

  {
    timestamps: true,
  }
);
module.exports = new mongoose.model("JobCategory", jobCategorySchema);
