const mongoose = require("mongoose");

const serviceEnquirySchema = mongoose.Schema(
  {
    serviceEnquiryId: {
      type: String,
      trim: true,
      unique: true,
    },
    serviceId: {
      type: String,
      trim: true,
      ref: "Service",
    },
    userId: {
      type: String,
      trim: true,
      ref: "User",
    
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceEnquiry", serviceEnquirySchema);
