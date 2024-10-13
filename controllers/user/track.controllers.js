const trackService = require("../../services/user/track.services");
class ServiceController{
    async trackOrder(req, res) {
        try {
          const result = await trackService.trackOrderService(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }
}
module.exports=new ServiceController();