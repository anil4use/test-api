const getNextSequenceValue = require("../utils/helpers/counter.utils");
const log = require("../configs/logger.config");
const eventModel = require("../models/event/event.model");

class EventDao {
  async addEvent(data) {
    try {
      const eventId = "Event_" + (await getNextSequenceValue("event"));
      data.eventId = eventId;

      const eventInfo = new eventModel(data);
      const result = await eventInfo.save();
      log.info("event saved");
      if (result) {
        return {
          message: "event created successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [EVENT DAO] : event creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [EVENT DAO] : ", error);
      throw error;
    }
  }

  //getSlotByServiceId
  async getSlotByServiceId(serviceId, timeSlot, startDate, endDate) {
    try {
      const { startTime, endTime } = timeSlot;
      const query = {
        serviceId,
        $or: [
          {
            startDate: { $lt: endDate },
            endDate: { $gt: startDate },
          },
          {
            startDate: { $gte: startDate, $lt: endDate },
            endDate: { $gt: startDate, $lte: endDate },
          },
          {
            startDate: { $lte: startDate },
            endDate: { $gte: endDate },
          },
        ],
        $or: [
          {
            "timeSlot.startTime": { $lt: endTime, $gte: startTime },
          },
          {
            "timeSlot.endTime": { $gt: startTime, $lte: endTime },
          },
          {
            $and: [
              { "timeSlot.startTime": { $lte: startTime } },
              { "timeSlot.endTime": { $gte: endTime } },
            ],
          },
        ],
      };

      const result = await eventModel.findOne(query);
      console.log("dsaggggggggggggggggggg", result);
      if (result) {
        return {
          message: "event found successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "event not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [EVENT DAO] : ", error);
      throw error;
    }
  }

  //getAllEvent
  async getAllEvent() {
    try {
      const result = await eventModel.find({}).populate([
        {
          path: "userId",
          localField: "userId",
          foreignField: "userId",
          select: "firstName lastName email contact",
        },
      ]);
      if (result) {
        return {
          message: "events found successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "event not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [EVENT DAO] : ", error);
      throw error;
    }
  }
  //getEventById
  async getEventById(eventId) {
    try {
      const result = await eventModel.findOne({ eventId });
      if (result) {
        return {
          message: "events found successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "event not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [EVENT DAO] : ", error);
      throw error;
    }
  }

  //updateEvent
  async updateEvent(eventId, data) {
    try {
      const result = await eventModel.findOneAndUpdate(
        { eventId: eventId },
        data,
        {
          new: true,
        }
      );
      log.info("event updated");
      if (result) {
        return {
          message: "event updated successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "event update fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [EVENT DAO] : ", error);
      throw error;
    }
  }

  //deleteEvent
  async deleteEvent(eventId) {
    try {
      const result = await eventModel.findOneAndDelete({ eventId });
      if (result) {
        return {
          message: "events deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "event deletion fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [EVENT DAO] : ", error);
      throw error;
    }
  }
  //getAllEventOfUser
  async getAllEventOfUser(userId) {
    try {
      const result = await eventModel.find({ userId });
      if (result) {
        return {
          message: "events deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "event deletion fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [EVENT DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new EventDao();
