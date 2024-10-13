const log = require("../../configs/logger.config");
const orderDao = require("../../daos/order.dao");
const {tracking} = require("../../utils/helpers/tracking.utils");
class TrackService {
  async trackOrderService(req, res) {
    try {
      const { orderId } = req.body;
      const orderDetails = await orderDao.getOrderById(orderId);
      const result=await tracking();
      if (result) {
        return res.status(200).json({
          message: "services get successfully",
          success: "success",
          code: 200,
          data:result.output.completeTrackResults[0],
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICES]: ", error);
      throw error;
    }
  }
}
module.exports = new TrackService();
