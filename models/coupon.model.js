const mongoose = require("mongoose");
const couponSchema = mongoose.Schema(
  {
    couponId:{
      type: String,
      required: true,
      unique: true,
    },
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    discount:{
        type:Number,
        required:true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      required: true,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    assignedUsers: [
      {
        type: String,
        ref: "User",
      },
    ],
    isActive: {
      type: Boolean,
      default:true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Coupon", couponSchema);
