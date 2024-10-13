const couponModel = require("../models/coupon.model");
const userModel = require("../models/user.model");
const log = require("../configs/logger.config");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
class CouponDao {
  async addCoupon(data) {
    try {
      const couponId = "coupon_" + (await getNextSequenceValue("coupon"));
      data.couponId = couponId;
      console.log(data);
      const coupon = new couponModel(data);
      const result = await coupon.save();
      console.log(result);
      if (result) {
        return {
          message: "coupon added successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "coupon creation fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //getAllCoupon

  async getAllCoupon() {
    try {
      const result = await couponModel.find();

      if (result) {
        return {
          message: "coupons get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "coupons not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //getCouponById
  async getCouponById(couponId) {
    try {
      const result = await couponModel.findOne({ couponId });

      if (result) {
        return {
          message: "coupons get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "coupons not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //deleteCoupon
  async deleteCoupon(couponId) {
    try {
      const result = await couponModel.findOneAndDelete({ couponId });

      if (result) {
        return {
          message: "coupons deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "coupons deletion fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //updateCoupon
  async updateCoupon(couponId, data) {
    try {
      const result = await couponModel.findOneAndUpdate(
        { couponId: couponId },
        data,
        {
          new: true,
        }
      );
      console.log(result);
      if (result) {
        return {
          message: "coupon updated successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "coupon update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //assignCouponToUser
  async assignCouponToUser(couponId, userId) {
    try {
      const result = await couponModel.findOneAndUpdate(
        { couponId: couponId },
        {
          $push: {
            assignedUsers: userId,
          },
        },
        {
          new: true,
        }
      );
      console.log(result);
      if (result) {
        return {
          message: "coupon added to user successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "coupon add to user fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //getCouponByUserId
  async getCouponByUserId(userId) {
    try {
      const result = await couponModel.aggregate([
        { $match: { assignedUsers: userId } },
        {
          $project: {
            couponId: 1,
            couponCode: 1,
            discount: 1,
            expiryDate: 1,
            _id: 1,
          },
        },
      ]);
      console.log(result);
      if (result) {
        return {
          message: "coupon get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "coupon fetched fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
  //getCouponByCouponCodeAndUserId
  async getCouponByCouponCodeAndUserId(couponCode, userId) {
    try {
      const result = await couponModel.findOne({
        couponCode: couponCode,
        assignedUsers: userId,
      });
       
      console.log(result);
      if (result) {
        return {
          message: "coupon get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "coupon fetched fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }

  async getCouponByCouponCode(couponCode) {
    try {
      const result = await couponModel.findOne({
        couponCode: couponCode,
      });
       
      console.log(result);
      if (result) {
        return {
          message: "coupon get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "coupon fetched fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [COUPON DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new CouponDao();
