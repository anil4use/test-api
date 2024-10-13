const eventService = require("../../services/admin/event.services");
class EventController {
  async createEvent(req, res) {
    try {
      const result = await eventService.createEventService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async getAllEvent(req, res) {
    try {
      const result = await eventService.getAllEventService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getEventById(req, res) {
    try {
      const result = await eventService.getEventByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateEventById(req, res) {
    try {
      const result = await eventService.updateEventByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteEvent(req, res) {
    try {
      const result = await eventService.deleteEventService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new EventController();
