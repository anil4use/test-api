const mongoose = require("mongoose");

const Role = new mongoose.Schema(
  {
    roleId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    permission: [
      {
        module: {
          type: String,
          trim: true,
        },
        create: {
          type: Boolean,
        },
        read: {
          type: Boolean,
        },
        update: {
          type: Boolean,
        },
        delete: {
          type: Boolean,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default:true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Role", Role);
