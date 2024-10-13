const log = require("../../configs/logger.config");
const subscriptionDao = require("../../daos/subscription.dao");
const {
  titleCase,
  removeNullUndefined,
} = require("../../utils/helpers/common.utils");
const { validateEmail } = require("../../utils/helpers/validator.utils");

class subscriptionService {
  async addSubscriptionService(req, res) {
    try {
      const {
        planName,
        description,
        monthlyPrice,
        yearlyPrice,
        isDiscount,
        discountPrice,
      } = req.body;
      const adminId = req.userId;

      if (
        !adminId ||
        !planName ||
        !description ||
        !monthlyPrice ||
        !yearlyPrice 
      ) {
        return res.status(400).json({
          message: "something went wrong",
          status: "success",
          code: 201,
          data: null,
        });
      }

      const data = {
        planName,
        description,
        monthlyPrice,
        yearlyPrice,
        isDiscount,
        discountPrice,
      };

      const updatedData = removeNullUndefined(data);
      const result = await subscriptionDao.addSubscription(updatedData);
      if (result.data){
        return res.status(200).json({
          message: "subscription added successfully",
          status: "success",
          code: 200,
        });
      }
    } catch (error) {
      log.error("Error from [SUBSCRIPTION SERVICE] : ", error);
      throw error;
    }
  }
  //getAllSubscriptionService
  async getAllSubscriptionService(req, res) {
    try {
      const adminId = req.userId;

      if (!adminId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "success",
          code: 201,
          data: null,
        });
      }

      const result = await subscriptionDao.getAllSubscription();
      if (result.data) {
        return res.status(200).json({
          message: "subscription get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          message: "subscription not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("Error from [SUBSCRIPTION DAO] : ", error);
      throw error;
    }
  }
  //deleteSubscriptionService
  async deleteSubscriptionService(req, res) {
    try {
      const adminId = req.userId;
      const { subsnId } = req.body;
      if (!adminId || !subsnId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "success",
          code: 201,
          data: null,
        });
      }

      const isExistSub = await subscriptionDao.getSubscriptionById(subsnId);
      if (!isExistSub.data) {
        return res.status(400).json({
          message: "subscription not found",
          status: "fail",
          code: 201,
        });
      }

      const result = await subscriptionDao.deleteSubscriptionById(subsnId);
      if (result.data) {
        return res.status(200).json({
          message: "subscription deleted successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "subscription deletion fail",
          status: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("Error from [SUBSCRIPTION DAO] : ", error);
      throw error;
    }
  }
  //updateSubscriptionService
  async updateSubscriptionService(req, res) {
    try {
      const {
        subsnId,
        planName,
        description,
        monthlyPrice,
        yearlyPrice,
        isDiscount,
        discountPrice,
        isActive,
      } = req.body;
      const adminId = req.userId;

      if (!adminId || !subsnId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "success",
          code: 201,
          data: null,
        });
      }

      const isExistSub = await subscriptionDao.getSubscriptionById(subsnId);
      if (!isExistSub.data) {
        return res.status(400).json({
          message: "subscription not found",
          status: "fail",
          code: 201,
        });
      }


      const data = {
        subsnId,
        planName,
        description,
        monthlyPrice,
        yearlyPrice,
        isDiscount,
        discountPrice,
        isActive,
      };
      const updatedData = removeNullUndefined(data);
      const result = await subscriptionDao.updateSubscription(subsnId, updatedData);
      if (result.data) {
        return res.status(200).json({
          message: "subscription updated successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "subscription update fail",
          status: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }
  //getSubByIdService
  async getSubscriptionByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { subsnId } = req.body;
      if (!adminId || !subsnId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "success",
          code: 201,
          data: null,
        });
      }
      const isExistSub = await subscriptionDao.getSubscriptionById(subsnId);
      if (!isExistSub.data) {
        return res.status(400).json({
          message: "subscription not found",
          status: "fail",
          code: 201,
        });
      }

      return res.status(200).json({
        message: "subscription get successfully",
        status: "success",
        code: 200,
        data: isExistSub.data,
      });
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }
}

module.exports = new subscriptionService();
