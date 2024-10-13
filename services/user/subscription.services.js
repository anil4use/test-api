const log = require("../../configs/logger.config");
const adminDao = require("../../daos/admin.dao");
const orderDao = require("../../daos/order.dao");
const subscriptionDao = require("../../daos/subscription.dao");
const userDao = require("../../daos/user.dao");
const { subscriptionPayment } = require("../../hook/payment");

class Subscription {
  async getAllSubscriptionService(req, res) {
    try {
      const result = await subscriptionDao.getAllSubscriptionForUser();

      if (result.data) {
        return res.status(200).json({
          message: "Subscriptions get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          message: "Subscriptions not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [USER SUBSCRIPTION]: ", error);
      throw error;
    }
  }
  //purchaseSubPlanService
  async purchaseSubPlanService(req, res) {
    try {
      const adminId = req.userId;
      const { subsnId, isYear } = req.body;
      if (!adminId || !subsnId || isYear) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isAdminExist = await adminDao.getById(adminId);
      if (!isAdminExist.data) {
        return res.status(400).json({
          message: "admin not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isSubExist = await subscriptionDao.getSubscriptionById(subsnId);

      if (!isSubExist.data) {
        return res.status(400).json({
          message: "subscription not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      let originalPrice = null;

      if (isYear) {
        originalPrice = isSubExist.data.yearlyPrice;
      }
      originalPrice = parseFloat(isSubExist.data.monthlyPrice);
      let discountPrice = parseFloat(isSubExist.data.discountPrice);
      let reducedPrice =
        originalPrice -
        (discountPrice = isSubExist.data.isDiscount
          ? isSubExist.data.discountPrice
          : 0);

      const taxPrice = 0;
      const totalPrice = taxPrice + reducedPrice;

      const data = {
        user: adminId,
        subsnId: subsnId,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      };
      const makeOrder = await orderDao.createOrder(data);
      const session = await subscriptionPayment(makeOrder.data);

      if (session) {
        return res.status(200).json({
          message: "order created successfully",
          status: "success",
          code: 200,
          data: session,
        });
      } else {
        return res.status(201).json({
          message: "order creation fail",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [USER SUBSCRIPTION]: ", error);
      throw error;
    }
  }
}
module.exports = new Subscription();
