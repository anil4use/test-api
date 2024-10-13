const CartService = require("../../services/user/cart.services");
class CartController {
  async addToCart(req, res) {
    try {
      const result = await CartService.addToCartService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //removeProductFromCart
  async removeProductFromCart(req, res) {
    try {
      const result = await CartService.removeProductFromCartService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getCart
  async getCart(req, res) {
    try {
      const result = await CartService.getCartService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //applyCoupon
  async applyCoupon(req, res) {
    try {
      const result = await CartService.applyCouponService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //removeAppliedCoupon
  async removeAppliedCoupon(req, res) {
    try {
      const result = await CartService.removeAppliedCouponService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //orderSummary
  async orderSummary(req, res) {
    try {
      const result = await CartService.orderSummaryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //resetCart
  async resetCart(req, res) {
    try {
      const result = await CartService.resetCartService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

}
module.exports = new CartController();
