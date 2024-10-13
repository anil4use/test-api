const log = require("../../configs/logger.config");
const adminDao = require("../../daos/admin.dao");
const barnDao = require("../../daos/barn.dao");
const eventDao = require("../../daos/event.dao");
const serviceDao = require("../../daos/service.dao");
const staffDao = require("../../daos/staff.dao");
const staffModel = require("../../models/staff/staff.model");
const {
  removeNullUndefined,
  randomString,
} = require("../../utils/helpers/common.utils");
const {
  validateEmail,
  validateUSAMobileNumber,
} = require("../../utils/helpers/validator.utils");
class EventService {
  async createEventService(req, res) {
    try {
      const adminId = req.userId;
      const {
        serviceId,
        eventTitle,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        description
      } = req.body;
      console.log("body", req.body);
      if (
        !adminId ||
        !serviceId ||
        !eventTitle ||
        !location ||
        !startDate ||
        !endDate ||
        !startTime ||
        !endTime ||
        !description
      ) {
        log.error("Error from [EVENT SERVICES]: invalid Request");
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          data: null,
          code: 201,
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
      slot => slot.startTime === startTime && slot.endTime === endTime
    );

    if (!availableSlot) {
      return res.status(400).json({
        message: "The selected time slot is not available in the service",
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

      const data = {
        eventTitle,
        location,
        startDate,
        endDate,
        timeSlot: timeSlot,
        description,
        serviceId,
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
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  async getAllEventService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await eventDao.getAllEvent();
      if (result) {
        return res.status(200).json({
          message: "event retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
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

  async getEventByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { eventId } = req.body;

      if (!adminId || !eventId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await eventDao.getEventById(eventId);
      if (result.data) {
        return res.status(200).json({
          message: "barn retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "barn not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
  //updateEventService
  async updateEventByIdService(req, res) {
    try {
      const adminId = req.userId;
      console.log(adminId);
      const {
        eventId,
        serviceId,
        eventTitle,
        location,
        startDate,
        endDate,
        startTime,
        endTime,
        description,
      } = req.body;
      if (!adminId || !eventId) {
        log.error("Error from [BARN SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      if (serviceId) {
        const isServiceExist = await serviceDao.getServiceById(serviceId);
        if (!isServiceExist.data) {
          return res.status(400).json({
            message: "service not found",
            status: "fail",
            data: null,
            code: 201,
          });
        }
      }

      let timeSlot = {
        startTime: startTime,
        endTime: endTime,
      };

      const service = isServiceExist.data;
      const availableSlot = service.timeSlot.some(
        slot => slot.startTime === startTime && slot.endTime === endTime
      );
  
      if (!availableSlot) {
        return res.status(400).json({
          message: "The selected time slot is not available in the service",
          status: "fail",
          data: null,
          code: 400,
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

      const data = {
        eventTitle,
        location,
        startDate,
        endDate,
        timeSlot: timeSlot,
        description,
        serviceId,
      };

      const result = await eventDao.updateEvent(eventId, data);
      console.log(result);
      if (result) {
        return res.status(200).json({
          message: "event update successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "event update failed",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [EVENT SERVICE]: ", error);
      throw error;
    }
  }
  //deleteEventService
  async deleteEventService(req, res) {
    try {
      const adminId = req.userId;
      const { eventId } = req.body;
      console.log(adminId);

      if (!adminId || !eventId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isExistEvent = await eventDao.getEventById(eventId);
      console.log(isExistEvent);
      if (!isExistEvent.data) {
        return res.status(200).json({
          message: "event not found",
          success: "fail",
          code: 201,
        });
      }

      const result = await eventDao.deleteEvent(eventId);
      if (result.data) {
        return res.status(200).json({
          message: "event deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(404).json({
          message: "event delete fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new EventService();
