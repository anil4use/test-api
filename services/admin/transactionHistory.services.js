const log = require("../../configs/logger.config");
const orderDao = require("../../daos/order.dao");
const { hashItem, compareItems } = require("../../utils/helpers/bcrypt.utils");
const {
  validateEmail,
  validateUSAMobileNumber,
} = require("../../utils/helpers/validator.utils");
const staffDao = require("../../daos/staff.dao");

class TransactionHistoryService {
  async transactionHistoryService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId) {
        log.error("Error from [AUTH SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const result = await orderDao.getAllTransaction();
      if (result.data) {
        return res.status(200).json({
          message: "transaction get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "no transaction found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [TRANSACTION SERVICE]: ", error);
      throw error;
    }
  }
  //paymentHistoryForBarnRentalService
  async paymentHistoryForBarnRentalService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId) {
        log.error("Error from [AUTH SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const result = await orderDao.paymentHistoryForBarnRental();
      if (result.data) {
        return res.status(200).json({
          message: "transaction get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "no transaction found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [TRANSACTION SERVICE]: ", error);
      throw error;
    }
  }

  //paymentHistoryForServicePurchaseService
  async paymentHistoryForServicePurchaseService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId) {
        log.error("Error from [AUTH SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const result = await orderDao.paymentHistoryForServicePurchase();
      if (result.data) {
        return res.status(200).json({
          message: "transaction get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "no transaction found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [TRANSACTION SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new TransactionHistoryService();
