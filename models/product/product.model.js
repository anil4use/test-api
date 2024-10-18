const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    categoryId: {
      type: String,
      trim: true,
      ref: "Category",
    },
    subCategoryId: {
      type: String,
      trim: true,
      ref: "Subcategory",
    },
    quantity: {
      type: Number,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
    },
    feature: {
      type: String,
      trim: true,
    },
    discount: {
      type: Boolean,
      trim: true,
    },
    discountPrice: {
      type: Number,
      default: 0,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      trim: true,
      default: "accept",
    },
    sales: {
      type: Number,
      trim: true,
      default: 0,
    },
    ownedBy: {
      type: String,
      trim: true,
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
    isRental: {
      type: Boolean,
      trim: true,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.index({ productId: 1, name: 1 }, { unique: true });
module.exports = mongoose.model("Product", productSchema);
