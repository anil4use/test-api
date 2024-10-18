const mongoose = require("mongoose");
const StaffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    shippingAddress: {
      type: String,
      trim: true,
    },
    pickupAddress: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      trim: true,
    },
    isValid: {
      type: Boolean,
      trim: true,
    },
    hash: {
      trim: true,
      type: String,
    },
    businessName: {
      trim: true,
      type: String,
    },
    businessAddress: {
      type: String,
      trim: true,
    },
    homeAddress: {
      type: String,
      trim: true,
    },
    bank: {
      accountHolder: {
        type: String,
        trim: true,
      },
      ACHOrWireRoutingNumber: {
        type: Number,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
      AccountType: {
        type: String,
        trim: true,
      },
      bankAddress: {
        type: String,
        trim: true,
      },
    },
    roleId: {
      type: String,
      ref: "Role",
      trim: true,
    },
    adminType: {
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
    zipCode: {
      type: Number,
      trim: true,
    },
    stateOrProvinceCode:{
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    parentId: {
      type: String,
      trim: true,
    },
    barnId: [
      {
        type: String,
        ref: "Barn",
        trim: true,
      },
    ],

    stripeAccountId: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Staff", StaffSchema);
