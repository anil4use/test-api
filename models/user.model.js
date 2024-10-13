const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    contact: {
      type: Number,
      trim: true,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      expires: "55s",
      index: true,
    },

    ResetOTP: {
      type: String,
      expires: "2m",
      index: true,
    },
    type: {
      type: String,
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
    },
    businessAddress: {
      type: String,
      trim: true,
    },
    homeAddress: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      default: "pending",
    },

    horseDetail: [
      {
        horseName: {
          type: String,
          trim: true,
        },
        horseBreed: {
          type: String,
          trim: true,
        },
        horseAge: {
          type: Number,
          trim: true,
        },
        images: [
          {
            type: String,
            trim: true,
          },
        ],
        horseDocument: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],

    loginType: {
      type: String,
      trim: true,
    },
    verificationToken: {
      type: String,
      trim: true,
    },
    verificationTokenExpires: {
      type: Date,
      default: 3600,
    },
    isAdmin:{
      type:Boolean,
      default:false,
    }
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("User", userSchema);
