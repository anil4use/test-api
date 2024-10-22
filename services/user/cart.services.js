const log = require("../../configs/logger.config");
const addressDao = require("../../daos/address.dao");
const adminDao = require("../../daos/admin.dao");
const barnDao = require("../../daos/barn.dao");
const cartDao = require("../../daos/cart.dao");
const couponDao = require("../../daos/coupon.dao");
const orderDao = require("../../daos/order.dao");
const productDao = require("../../daos/product.dao");
const userDao = require("../../daos/user.dao");

const {
  shippingRate,
  createShippingRequest,
  validateAddress,
} = require("../../utils/helpers/tracking.utils");
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
      console.log("ssssssssssss",isCartExist);
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
      const { addressId } = req.body;
      if (!userId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }



      let totalShippingCharge = 0;
      let recipientAddress = null;
      if (addressId) {
        const addressDetail = await addressDao.getAddressById(
          addressId,
          userId
        );

        console.log("fffffffffffffff", addressDetail.data);
        if (!addressDetail.data) {
          return res.status(400).json({
            message: "address not found",
            success: "fail",
            code: 201,
            data: null,
          });
        }

        recipientAddress = {
          streetLines: addressDetail.data.street,
          city: addressDetail.data.city,
          postalCode: (addressDetail?.data?.zipCode).toString(),
          countryCode: "US",
          residential: true,
        };
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

      const isCartExist = await cartDao.getCartByUserId(userId);
      
      console.log(isCartExist.data);
      console.log(isCartExist);
      const totalItem = isCartExist.data.item.length;
      console.log("total item", totalItem);
      const totalPrice = isCartExist.data.totalPrice;
      const cartItems = isCartExist.data.item;
      let vendorAddress = null;

      for (const item of cartItems) {
        console.log("ffffffffffffffffffffffffffffff", item.productId);
        const product = await productDao.getProductById(item.productId);
        console.log("ffffffffffffffffffffffff", product);

        const admin = product?.data?.ownedBy;

        if (admin?.startsWith("Barn_")) {
          const barnDetail = await barnDao.getBarnById(admin);
          const barnAddress = await barnDao.getBarnAddress(
            barnDetail.data.location.latitude,
            barnDetail.data.location.longitude
          );

          const address = barnAddress.data;
          const addressDetail = address.split(",").map((part) => part.trim());

          const country = addressDetail[addressDetail.length - 1];
          const postalCode = addressDetail[addressDetail.length - 2];
          const state = addressDetail[addressDetail.length - 3];
          const city = addressDetail[addressDetail.length - 4];

          vendorAddress = {
            city: city,
            postalCode: postalCode,
            countryCode: "US",
            residential: false,
          };
        } else {
          const adminDetail = await adminDao.getById(admin);
          vendorAddress = {
            city: adminDetail.data.city,
            postalCode: adminDetail.data.zipCode,
            countryCode: "US",
            residential: false,
          };
        }

        const requestedPackageLineItems = Array(item.quantity).fill({
          weight: {
            units: "LB",
            value: parseFloat(product?.data?.weight).toFixed(1),
          },
        });

        const totalWeight = parseFloat(product?.data?.weight) * item.quantity;

        const shippingCharge = await shippingRate(
          vendorAddress,
          recipientAddress,
          requestedPackageLineItems,
          totalWeight
        );

        totalShippingCharge += shippingCharge;
      }

      const orderTotal = totalPrice + totalShippingCharge;
      const cartId = isCartExist.data.cartId;

      
      const data = {
        totalShippingCharge: totalShippingCharge.toFixed(2),
      };

      const updatedCart = await cartDao.updateCartForShippingCharge(
        userId,
        data
      );

      const orderSummary = {
        items: totalItem,
        totalPrice: totalPrice,
        shipping: (totalShippingCharge).toFixed(2) || 0,
        orderTotal: (orderTotal).toFixed(2),
      };

      if (isCartExist.data.item.length > 0) {
        return res.status(200).json({
          message: "order summary get successfully",
          status: "success",
          code: 200,
          data: orderSummary,
        });
      } else {
        return res.status(201).json({
          message: "cart is empty",
          status: "success",
          code: 200,
          data: [],
        });
      }

      // const shipping = await validateAddress(recipientAddress);
      // const { orderId } = req.body;
      // const order = await orderDao.getOrderById(orderId);
      // if (!order.data) {
      //   return res.status({
      //     message: "order not exist",
      //     success: "fail",
      //     code: 201,
      //     data: null,
      //   });
      // }
      // const orderDetails = order.data;
      // // const userId = orderDetails.user;
      // const address = orderDetails.shippingInfo;
      // console.log("sd", orderDetails);
      // console.log("address", address);
      // const itemId = orderDetails.orderItems[0]._id;
      // const recipientAddress = {
      //   streetLines: address?.street,
      //   postalCode: (address?.zipCode).toString(),
      //   city: address.city,
      //   stateOrProvinceCode: address?.stateOrProvinceCode,
      //   personName: `${address?.firstName} ${address?.lastName}`,
      //   phoneNumber: (address?.contact).toString(),
      // };

      // console.log("recipientAddress", recipientAddress);

      // let shippingDetail = null;

      // for (const item of orderDetails?.orderItems) {
      //   const product = await productDao.getProductById(item?.product);
      //   const admin = product?.data?.ownedBy;
      //   let vendorAddress;

      //   if (admin?.startsWith("Barn_")) {
      //     const barnDetail = await barnDao.getBarnById(admin);
      //     const barnAddress = await barnDao.getBarnAddress(
      //       barnDetail.data.location.latitude,
      //       barnDetail.data.location.longitude
      //     );

      //     const address = barnAddress.data;
      //     const addressDetail = address.split(",").map((part) => part.trim());
      //     console.log("ffffffffffffffff", addressDetail);
      //     const country = addressDetail[addressDetail.length - 1];
      //     const postalCode = addressDetail[addressDetail.length - 2];
      //     const state = addressDetail[addressDetail.length - 3];
      //     const city = addressDetail[addressDetail.length - 4];
      //     console.log("postal code ", postalCode);
      //     console.log("ssssssssssssssssssssssssss");
      //     vendorAddress = {
      //       streetLines: barnDetail?.data?.contact?.address,
      //       postalCode: postalCode,
      //       city: city,
      //       stateOrProvinceCode: barnDetail?.data?.contact?.stateOrProvinceCode,
      //       personName: barnDetail?.data?.name,
      //       phoneNumber: barnDetail?.data?.contact?.phoneNumber,
      //     };
      //   } else {
      //     const adminDetail = await adminDao.getById(admin);
      //     console.log("ssssssssssssssssssssssssss");
      //     vendorAddress = {
      //       streetLines: adminDetail.data.pickupAddress,
      //       city: adminDetail.data.city,
      //       postalCode: adminDetail.data.zipCode.toString(),
      //       stateOrProvinceCode: adminDetail.data.stateOrProvinceCode,
      //       personName: adminDetail?.data?.name,
      //       phoneNumber: adminDetail?.data?.contact,
      //     };
      //   }

      //   const requestedPackageLineItems = Array(item.quantity).fill({
      //     weight: {
      //       units: "LB",
      //       value: parseFloat(product?.data?.weight).toFixed(1),
      //     },
      //   });

      //   const totalWeight = parseFloat(product?.data?.weight) * item.quantity;
      //   shippingDetail = await createShippingRequest(
      //     vendorAddress,
      //     recipientAddress,
      //     requestedPackageLineItems,
      //     totalWeight
      //   );

      //   const trackingNumber =
      //     shippingDetail.transactionShipments[0].pieceResponses[0]
      //       .trackingNumber;

      //   const level =
      //     shippingDetail.transactionShipments[0].pieceResponses[0]
      //       .packageDocuments[0].url;

      //   const order = await orderDao.updateTrackingDetail(
      //     orderId,
      //     itemId,
      //     trackingNumber,
      //     level
      //   );
      // }

      return res.status(200).json({
        message: "order summary get successfully",
        status: "success",
        code: 200,
        data: shippingDetail,
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
