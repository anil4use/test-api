const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      trim: true,
      required: true,
    },
    serviceId: {
      type: String,
      trim: true,
    },
    eventTitle: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      trim: true,
    },
    endDate: {
      type: Date,
      trim: true,
    },
    timeSlot: {
      startTime: {
        type: String,
        trim: true,
      },
      endTime: {
        type: String,
        trim: true,
      },
    },
    description: {
      type: String,
      trim: true,
    },
    userId:{
        type:String,
        ref:"User",
        trim:true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
