const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      trim: true,
    },
    receiverId: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    media: [{
        type: String,
        trim: true,
      }
    ],
    unread : {
      type: Boolean,
      trim: true,
      default: true
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("ChatMessage", chatSchema);
