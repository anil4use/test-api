const mongoose = require("mongoose");
const BarnServiceProviderSchema = new mongoose.Schema(
  {
    barnId: {
      type: String,
      ref: "Barn",
      required: true,
    },
    serviceProvider: {
      type: String,
      ref: "ServiceProvider",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "BarnServiceProvider",
  BarnServiceProviderSchema
);
