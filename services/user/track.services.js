const log = require("../../configs/logger.config");
const orderDao = require("../../daos/order.dao");
const { tracking } = require("../../utils/helpers/tracking.utils");
class TrackService {
  async trackOrderService(req, res) {
    try {
      const {trackingId, productId } = req.body;
    console.log("fdsaga",trackingId,productId);
      if (!trackingId || !productId) {
        return res.status(200).json({
          message: "something went wrong",
          status: "fail",
          code: 200,
          data: null,
        });
      }
      const isOrderExist = await orderDao.getOrderByTrackingAndProduct(
        trackingId,
        productId
      );
      const result = await tracking(trackingId);
      const  trackResult= result.completeTrackResults[0].trackResults[0].scanEvents[0];
       
      if (trackResult) {
        return res.status(200).json({
          message: "order tracking get successfully",
          status: "success",
          code: 200,
          data:{
            orderResult:isOrderExist?.data,
            trackResult
          }
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICES]: ", error);
      throw error;
    }
  }
}
module.exports = new TrackService();
