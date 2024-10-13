const mongoose = require("mongoose");
const ServiceProviderSchema = new mongoose.Schema(
  {
    serviceProvider: {
      type: String,
      ref: "Staff",
      required: true,
    },
    services: [
      {
        type: String,
        ref: "Service",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceProvider", ServiceProviderSchema);
