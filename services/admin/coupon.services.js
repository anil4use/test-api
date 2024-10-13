const log = require("../../configs/logger.config");
const couponDao = require("../../daos/coupon.dao");
const { validateEmail } = require("../../utils/helpers/validator.utils");

class CouponService {
  async addCouponService(req, res) {
    try {
      const { couponCode, discount, usageLimit, expiryDate } = req.body;
      const adminId = req.userId;

      if (!adminId || !couponCode || !discount || !usageLimit || !expiryDate) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }

      const data = {
        couponCode,
        discount,
        usageLimit,
        expiryDate,
      };

      const result = await couponDao.addCoupon(data);
      if (result.data) {
        return res.status(200).json({
          message: "coupon added successfully",
          success: "success",
          code: 200,
        });
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //getAllCouponService
  async getAllCouponService(req, res) {
    try {
      const adminId = req.userId;

      if (!adminId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }

      const result = await couponDao.getAllCoupon();
      if (result.data) {
        return res.status(200).json({
          message: "coupons get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "coupons not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //deleteCouponService
  async deleteCouponService(req, res) {
    try {
      const adminId = req.userId;
      const { couponId } = req.body;
      if (!adminId || !couponId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }

      const isExistCart = await couponDao.getCouponById(couponId);
      if (!isExistCart.data) {
        return res.status(400).json({
          message: "coupon not found",
          success: "success",
          code: 201,
        });
      }

      const result = await couponDao.deleteCoupon(couponId);
      if (result.data) {
        return res.status(200).json({
          message: "coupon deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "coupon deletion fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //updateCouponService
  async updateCouponService(req, res) {
    try {
      const { couponId, couponCode, discount, usageLimit, expiryDate,isActive } =
        req.body;
      const adminId = req.userId;

      if (
        !adminId ||
        !couponId ||
        !couponCode ||
        !discount ||
        !usageLimit ||
        !expiryDate
      ) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }

      const isExistCoupon = await couponDao.getCouponById(couponId);

      if (!isExistCoupon) {
        return res.status(400).json({
          message: "coupon not found",
          success: "fail",
          code: 201,
        });
      }
      const data = {
        couponCode,
        discount,
        usageLimit,
        expiryDate,
        isActive
      };
      const result = await couponDao.updateCoupon(couponId, data);
      if (result.data) {
        return res.status(200).json({
          message: "coupon updated successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "coupon update fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //getCouponByIdService
  async getCouponByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { couponId } = req.body;
      if (!adminId || !couponId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }

      const result = await couponDao.getCouponById(couponId);
      if (result.data) {
        return res.status(200).json({
          message: "coupons get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "coupons not found",
          success: "fail",
          code: 201,
          data: result.data,
        });
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //assignCouponByUserIdService
  async assignCouponByUserIdService(req, res) {
    try {
      const adminId = req.userId;
      const { couponId, userId } = req.body;
      if (!adminId || !couponId || !userId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isCouponExist = await couponDao.getCouponById(couponId);
      if (!isCouponExist.data) {
        return res.status(200).json({
          message: "coupons not found",
          success: "success",
          code: 200,
          data: result.data,
        });
      }

      const result = await couponDao.assignCouponToUser(couponId, userId);

      if (result.data) {
        return res.status(200).json({
          message: "coupon assigned to user",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "coupon assigned fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
}

module.exports = new CouponService();
