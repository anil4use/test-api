const mongoose = require("mongoose");
const adsCampaignSchema = new mongoose.Schema(
  {
    adsId: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: String,
      ref: "Product",
    },
    serviceId: {
      type: String,
      ref: "Service",
    },
    barnId:{
        type: String,
        ref: "Barn",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    adsSection: {
      type: String,
      trim: true,
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

module.exports = mongoose.model("AdsCampaign", adsCampaignSchema);
