const EventService = require("../../services/user/event.services");
class EventController {
  async bookEvent(req, res) {
    try {
      const result = await EventService.bookEventService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }


  //getAllBookedEvent
  async getAllBookedEvent(req, res) {
    try {
      const result = await EventService.getAllBookedEventService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }


  // //redirect
  // async redirect(req, res) {
  //   try {
  //     const result = await EventService.redirectService(req, res);
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // //scheduleEvent
  // async scheduleEvent(req, res) {
  //   try {
  //     const result = await EventService.scheduleEventService(req, res);
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
module.exports = new EventController();
