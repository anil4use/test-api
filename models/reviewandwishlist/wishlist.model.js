const mongoose = require("mongoose");
const wishListSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      trim: true,
      ref: "User",
    },
    wishList: [
      {
        type: String,
        trim: true,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Wishlist", wishListSchema);
