const subscriptionService = require("../../services/admin/subscription.services");
class subscriptionController {
  async addSubscription(req, res) {
    try {
      const result = await subscriptionService.addSubscriptionService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async getAllSubscription(req, res) {
    try {
      const result = await subscriptionService.getAllSubscriptionService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteSubscription(req, res) {
    try {
      const result = await subscriptionService.deleteSubscriptionService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateSubscription(req, res) {
    try {
      const result = await subscriptionService.updateSubscriptionService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getSubscriptionById(req, res) {
    try {
      const result = await subscriptionService.getSubscriptionByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new subscriptionController();
