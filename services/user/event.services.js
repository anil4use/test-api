const log = require("../../configs/logger.config");
const eventDao = require("../../daos/event.dao");
const { dayjs } = require("dayjs");
const {
  validateUSAMobileNumber,
  validateEmail,
  titleCase,
} = require("../../utils/helpers/validator.utils");
const {
  url,
  oauth2Client,
  calender,
  GOOGLE_API_KEY,
} = require("../../utils/helpers/google.utils");
const serviceDao = require("../../daos/service.dao");

class EventService {
  //bookEventService

  async bookEventService(req, res) {
    try {
      const userId = req.userId;
      const { location, serviceId, startDate, endDate, startTime, endTime } =
        req.body;

      if (
        !location ||
        !serviceId ||
        !startDate ||
        !endDate ||
        !startTime ||
        !endTime
      ) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isServiceExist = await serviceDao.getServiceById(serviceId);
      if (!isServiceExist.data) {
        return res.status(400).json({
          message: "service not found",
          status: "fail",
          data: null,
          code: 201,
        });
      }

      let timeSlot = {
        startTime: startTime,
        endTime: endTime,
      };

      const service = isServiceExist.data;
      const availableSlot = service.timeSlot.some(
        (slot) => slot.startTime === startTime && slot.endTime === endTime
      );

      if (!availableSlot) {
        return res.status(400).json({
          message: "The selected time slot is not exist",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isSlotExist = await eventDao.getSlotByServiceId(
        serviceId,
        timeSlot,
        startDate,
        endDate
      );

      if (isSlotExist.data) {
        return res.status(400).json({
          message: "please select another slot",
          status: "fail",
          data: null,
          code: 201,
        });
      }

      let eventTitle = null;
      let description = null;

      eventTitle = service?.name;
      description = service?.description;

      const data = {
        eventTitle: eventTitle,
        location,
        startDate,
        endDate,
        timeSlot: timeSlot,
        description: description,
        serviceId,
        userId,
      };

      const result = await eventDao.addEvent(data);
      if (result.data) {
        return res.status(200).json({
          message: "event created successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "event creation failed",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [EVENT SERVICE]: ", error);
      throw error;
    }
  }

  //getAllEventOfUser
  //getAllBookedEventService
  async getAllBookedEventService(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await eventDao.getAllEventOfUser(userId);

      if (result.data) {
        return res.status(200).json({
          message: "event get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "event not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [EVENT SERVICE]: ", error);
      throw error;
    }
  }

  async createEventService(req, res) {
    try {
      const googleCalenderUrl = url;
      console.log(googleCalenderUrl);
      if (googleCalenderUrl) {
        return res.status(200).json({
          message: "url get successfully",
          status: "success",
          code: 200,
          data: googleCalenderUrl,
        });
      } else {
        return res.status(200).json({
          message: "url not found",
          status: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [EVENT SERVICE]: ", error);
      throw error;
    }
  }

  //redirectService
  async redirectService(req, res) {
    try {
      const { code } = req.body;
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      return res.status(200).json({
        message: "login successfully",
        status: "success",
        code: 200,
      });
    } catch (error) {
      log.error("error from [EVENT SERVICE]: ", error);
      throw error;
    }
  }
  //scheduleEventService
  async scheduleEventService(req, res) {
    try {
      const { date, timeSlot } = req.body;
      const startTime = dayjs(date + "T" + timeSlot).toISOString();
      const endTime = dayjs(startTime).add(1, "hour").toISOString();
      const event = calender.events.insert({
        calendarId: "primary",
        auth: oauth2Client,
        requestBody: {
          summary: "this is a test event",
          description: "lorem epsom",
          start: {
            dateTime: startTime,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: endTime,
            timeZone: "Asia/Kolkata",
          },
        },
      });
      console.log("Event created:", event.data);

      return res.status(200).json({
        message: "done successfully",
        status: "success",
        code: 200,
        data: event.data,
      });
    } catch (error) {
      log.error("error from [EVENT SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new EventService();
