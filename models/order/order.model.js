const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },

    paymentId: {
      type: String,
      trim: true,
    },

    orderStatus: {
      type: String,
      trim: true,
      default: "unpaid",
    },

    shippingInfo: {
      firstName: {
        type: String,
        trim: true,
      },
      lastName: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
      contact: {
        type: Number,
        trim: true,
      },
      zipCode: {
        type: Number,
        trim: true,
      },
      street: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      stateOrProvinceCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    orderType: {
      type: String,
      trim: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          trim: true,
        },
        vendorId: {
          type: String,
          required: false,
        },
        vendorType: {
          type: String,
          enum: ["barnOwner", "serviceProvider", "rentalProduct", "superAdmin"],
          required: false,
        },
        originalPrice: {
          type: Number,
          trim: true,
        },
        discount: {
          type: Number,
          trim: true,
        },
        reducedPrice: {
          type: Number,
          trim: true,
        },
        quantity: {
          type: Number,
          trim: true,
        },
        coverImage: {
          type: String,
          trim: true,
        },
        product: {
          type: String,
          ref: "Product",
          trim: true,
        },
        service: {
          type: String,
          ref: "Service",
          trim: true,
        },
        servicePurchaseDay: {
          type: String,
          trim: true,
        },
        trackingNumber: {
          type: String,
          trim: true,
        },
        level: {
          type: String,
          trim: true,
        },
      },
    ],
    user: {
      type: String,
      required: true,
    },
    paidAt: {
      type: Date,
      required: false,
    },
    couponPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    rentalId: {
      type: String,
      trim: true,
    },
    subsnId: {
      type: String,
      trim: true,
    },
    barnRentalId: {
      type: String,
      trim: true,
    },
    serviceRentId: {
      type: String,
      trim: true,
    },
    invoiceUrl: {
      type: String,
      trim: true,
    },
    track: {
      type: String,
      required: true,
      default: "Processing",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: {
      type: Date,
      default: function () {
        return new Date(this.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
      },
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

module.exports = mongoose.model("Order", orderSchema);
