const log = require("../../configs/logger.config");
const addressDao = require("../../daos/address.dao");
const cartDao = require("../../daos/cart.dao");
const couponDao = require("../../daos/coupon.dao");
const productDao = require("../../daos/product.dao");
const userDao = require("../../daos/user.dao");
const { shippingRate, createShippingRequest } = require("../../utils/helpers/tracking.utils");
const {
  validateUSAMobileNumber,
  validateEmail,
  titleCase,
} = require("../../utils/helpers/validator.utils");
class CartService {
  async addToCartService(req, res) {
    try {
      let { cart } = req.body;
      const userId = req.userId;

      let cartId = null;

      if (!userId || !Array.isArray(cart)) {
        log.error("Error from [CART SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(400).json({
          message: "user not found",
          success: "fail",
          code: 201,
        });
      }

      const isCartExist = await cartDao.getCartByUserIdAndStatus(userId);
      const cartData = {
        item: cart,
        userId,
      };

      const productId = cart[0].productId;
      const quantity = cart[0].quantity;
      console.log(productId);
      console.log(quantity);

      const isQuantityExist = await productDao.getProductById(productId);
      console.log(isQuantityExist.data);
      if (!isQuantityExist.data) {
        return res.status(400).json({
          message: "product not exist",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      if (isQuantityExist.data.quantity < quantity) {
        return res.status(201).json({
          message: "product out of stock",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      let cartDetail = null;
      if (isCartExist.data) {
        cartDetail = await cartDao.updateCart(userId, cartData);
        cartId = cartDetail.data.cartId;
        console.log(cartId);
      } else {
        cartDetail = await cartDao.addCart(cartData);
      }
      if (cartDetail.data) {
        return res.status(200).json({
          message: "product added successfully",
          success: "success",
          code: 200,
          // data: cartDetail.data,
        });
      } else {
        return res.status(200).json({
          message: "product add fail",
          success: "fail",
          code: 201,
          // data: null,
        });
      }
    } catch (error) {
      log.error("error from [CART SERVICE]: ", error);
      throw error;
    }
  }
  //removeProductFromCartService
  async removeProductFromCartService(req, res) {
    try {
      const { cartId, productId } = req.body;
      const userId = req.userId;
      if (!userId || !cartId || !productId) {
        log.error("Error from [CART SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(400).json({
          message: "user not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isCartExist = await cartDao.getCartByUserIdAndStatus(userId);

      if (!isCartExist.data) {
        return res.status(400).json({
          message: "cart not found",
          success: "fail",
          code: 201,
        });
      }
      const isExistByCartId = await cartDao.getCartById(cartId);
      if (!isExistByCartId.data) {
        return res.status(400).json({
          message: "cart not found",
          success: "fail",
          code: 201,
        });
      }

      const result = await cartDao.removeProductFromCart(cartId, productId);
      if (result.data) {
        return res.status(200).json({
          message: "product remove successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "product remove fail",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [CART SERVICE]: ", error);
      throw error;
    }
  }
  //getCartService
  async getCartService(req, res) {
    try {
      const userId = req.userId;

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(400).json({
          message: "user not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isCartExist = await cartDao.getCartByUserIdAndStatus(userId);
      console.log(isCartExist);
      if (isCartExist.data) {
        return res.status(200).json({
          message: "cart get successfully",
          success: "success",
          code: 200,
          data: isCartExist.data,
        });
      } else {
        return res.status(201).json({
          message: "cart not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [CART SERVICE]: ", error);
      throw error;
    }
  }
  //applyCouponService
  async applyCouponService(req, res) {
    try {
      const userId = req.userId;
      const { couponCode } = req.body;
      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(400).json({
          message: "user not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isCartExist = await cartDao.getCartByUserIdAndStatus(userId);
      console.log(isCartExist.data);
      if (!isCartExist.data) {
        return res.status(400).json({
          message: "cart not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isCouponExist = await couponDao.getCouponByCouponCode(couponCode);
      if (!isCouponExist.data) {
        return res.status(400).json({
          message: "coupon not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      if (isCouponExist.data.expiryDate < Date.now()) {
        return res.status(201).json({
          message: "coupon has expired",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isUserHaveCoupon = await couponDao.getCouponByCouponCodeAndUserId(
        couponCode,
        userId
      );

      console.log(isUserHaveCoupon.data);

      if (!isUserHaveCoupon.data) {
        return res.status(400).json({
          message: "invalid coupon",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      console.log(isCartExist.data.item);
      if (isCartExist.data.item.length === 0) {
        return res.status(201).json({
          message: "please add product to apply coupon",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const data = {
        isCouponApplied: true,
        couponId: isCouponExist.data.couponId,
      };
      const result = await cartDao.updateCartForCoupon(
        userId,
        couponCode,
        data
      );
      if (result.data) {
        return res.status(200).json({
          message: "coupon applied successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(200).json({
          message: "coupon applied fail",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [CART SERVICE]: ", error);
      throw error;
    }
  }
  //removeAppliedCouponService
  async removeAppliedCouponService(req, res) {
    try {
      const userId = req.userId;
      const { couponCode } = req.body;
      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(400).json({
          message: "user not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isCouponExist = await couponDao.getCouponByCouponCodeAndUserId(
        couponCode,
        userId
      );

      if (!isCouponExist.data) {
        return res.status(400).json({
          message: "coupon not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isCartExist = await cartDao.getCartByUserIdAndStatus(userId);
      console.log(isCartExist.data);
      if (!isCartExist.data) {
        return res.status(400).json({
          message: "cart not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const data = {
        isCouponApplied: false,
        couponId: null,
      };
      const result = await cartDao.removeCoupon(userId, data);

      if (result.data) {
        return res.status(200).json({
          message: "coupon removed successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(200).json({
          message: "coupon remove fail",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [CART SERVICE]: ", error);
      throw error;
    }
  }
  //orderSummaryService
  async orderSummaryService(req, res) {
    try {
      const userId = req.userId;

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(400).json({
          message: "user not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      // const isCartExist = await cartDao.getCartByUserId(userId);
      // console.log(isCartExist.data);
      // console.log(isCartExist);
      // const totalItem = isCartExist.data.item.length;
      // const totalPrice = isCartExist.data.totalPrice;
      // const shippingCharge = await shippingRate();
      // const orderTotal = totalPrice + shippingCharge;
      // const cartId = isCartExist.data.cartId;
      // const orderSummary = {
      //   items: totalItem,
      //   totalPrice: totalPrice,
      //   shipping: shippingCharge,
      //   orderTotal: orderTotal,
      // };

      // if (isCartExist.data.item.length > 0) {
      //   return res.status(200).json({
      //     message: "order summary get successfully",
      //     status: "success",
      //     code: 200,
      //     data: orderSummary,
      //   });
      // } else {
      //   return res.status(201).json({
      //     message: "cart is empty",
      //     status: "success",
      //     code: 200,
      //     data: [],
      //   });
      // }
      const result=await createShippingRequest();
      return res.status(200).json({
        message: "order summary get successfully",
        status: "success",
        code: 200,
        data: result,
      });
    } catch (error) {
      log.error("error from [CART SERVICE]: ", error);
      throw error;
    }
  }
  //resetCartService
  async resetCartService(req, res) {
    try {
      const { cartId } = req.body;
      const userId = req.userId;
      if (!userId || !cartId) {
        log.error("Error from [CART SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(400).json({
          message: "user not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isCartExist = await cartDao.getCartByUserIdAndStatus(userId);

      if (!isCartExist.data) {
        return res.status(400).json({
          message: "cart not found",
          success: "fail",
          code: 201,
        });
      }

      const isExistByCartId = await cartDao.getCartById(cartId);
      if (!isExistByCartId.data) {
        return res.status(400).json({
          message: "cart not found",
          success: "fail",
          code: 201,
        });
      }

      const result = await cartDao.resetCart(cartId);
      if (result.data) {
        return res.status(200).json({
          message: "cart reset successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "cart reset fail",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [CART SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new CartService();
