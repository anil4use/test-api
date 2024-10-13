const couponService = require("../../services/admin/coupon.services");
class CouponController {
  async addCoupon(req, res) {
    try {
      const result = await couponService.addCouponService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async getAllCoupon(req, res) {
    try {
      const result = await couponService.getAllCouponService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteCoupon(req, res) {
    try {
      const result = await couponService.deleteCouponService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateCoupon(req, res) {
    try {
      const result = await couponService.updateCouponService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getCouponById(req, res) {
    try {
      const result = await couponService.getCouponByIdService(req, res);
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
module.exports = new CouponController();
