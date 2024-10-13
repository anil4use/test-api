const adsCampaignService = require("../../services/admin/adsCampaign.services");
class AdsCampaignController {
  async addAdsCampaign(req, res) {
    try {
      const result = await adsCampaignService.addAdsCampaignService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async getAllAdsCampaign(req, res) {
    try {
      const result = await adsCampaignService.getAllAdsCampaignService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteAdsCampaign(req, res) {
    try {
      const result = await adsCampaignService.deleteAdsCampaignService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateAdsCampaign(req, res) {
    try {
      const result = await adsCampaignService.updateAdsCampaignService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getCampaignById(req, res) {
    try {
      const result = await adsCampaignService.getCampaignByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //assignCouponByUserId
  async assignCouponByUserId(req, res) {
    try {
      const result = await couponService.assignCouponByUserIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new AdsCampaignController();
