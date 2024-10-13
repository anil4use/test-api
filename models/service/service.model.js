const mongoose = require("mongoose");
const serviceSchema = mongoose.Schema(
  {
    serviceId: {
      type: String,
      unique: true,
    },
    serviceCategoryId: {
      type: String,
      trim: true,
      ref: "ServiceCategory",
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    feature: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: false,
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
    streetName: {
      type: String,
      trim: true,
    },
    location: {
      latitude: {
        type: String,
        trim: true,
      },
      longitude: {
        type: String,
        trim: true,
      },
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
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
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      trim: true,
      default: "pending",
    },
    ownedByBarn: {
      type: String,
      trim: true,
    },
    providedBy: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: String,
      trim: true,
    },

    timeSlot: [
      {
        startTime: {
          type: String,
          trim: true,
        },
        endTime: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports = new mongoose.model("Service", serviceSchema);
