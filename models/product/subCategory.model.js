const mongoose = require("mongoose");
const subcategorySchema = new mongoose.Schema(
  {
    subCategoryId: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: String,
      trim: true,
      ref: "Category",
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
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Subcategory", subcategorySchema);
