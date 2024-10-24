const log = require("../../configs/logger.config");
const orderDao = require("../../daos/order.dao");
const { titleCase } = require("../../utils/helpers/validator.utils");
const { removeNullUndefined } = require("../../utils/helpers/common.utils");
const addressDao = require("../../daos/address.dao");
const cartDao = require("../../daos/cart.dao");
const { productPaymentHook } = require("../../hook/payment");
const adminDao = require("../../daos/admin.dao");
const barnDao = require("../../daos/barn.dao");
class OrderService {
  async createOrderService(req, res) {
    try {
      const { addressId } = req.body;
      const userId = req.userId;

      const isAddressExist = await addressDao.getAddressById(addressId, userId);
      if (!isAddressExist.data) {
        return res.status(400).json({
          message: "address not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      console.log("is address exist ", isAddressExist.data);

      const cartExist = await cartDao.getCartByUserIdAndStatus(userId);
      if (!cartExist.data || cartExist.data.item.length === 0) {
        return res.status(400).json({
          message: "cart is empty",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      console.log(cartExist.data);

      const shippingInfo = {
        firstName: isAddressExist?.data?.firstName,
        lastName: isAddressExist?.data?.lastName,
        email: isAddressExist?.data?.email,
        contact: isAddressExist?.data?.contact,
        zipCode: isAddressExist?.data?.zipCode,
        street: isAddressExist?.data?.street,
        state: isAddressExist?.data?.state,
        city: isAddressExist?.data?.city,
        country: isAddressExist?.data?.country,
        stateOrProvinceCode: isAddressExist?.data?.stateOrProvinceCode,
      };
      console.log("sssssssssssss", cartExist.data);
      const orderItems = await Promise.all(
        cartExist.data.item.map(async (item) => {
          console.log("cccccc", item.product);
          let originalPrice = parseFloat(item.product.price);
          let discountPrice = parseFloat(item.product.discountPrice);
          const reducedPrice =
            originalPrice - (item.product.discount ? discountPrice : 0);

          const orderItem = {
            name: item.product.name,
            originalPrice: originalPrice,
            discount: discountPrice,
            reducedPrice: reducedPrice,
            quantity: item?.quantity,
            coverImage: item?.product?.coverImage,
            product: item?.productId,
            vendorId: item?.product?.ownedBy,
            vendorType: null,
          };

          const ownedBy = item.product.ownedBy;
          const isAdmin = await adminDao.getById(ownedBy);
          if (isAdmin.data) {
            orderItem.vendorType = isAdmin.data.adminType;
          } else {
            const barnDetail = await barnDao.getBarnById(ownedBy);
            if (barnDetail.data) {
              const barnOwner = await adminDao.getById(
                barnDetail.data.barnOwner
              );
              if (barnOwner.data) {
                orderItem.vendorType = barnOwner.data.adminType;
              }
            }
          }

          return orderItem;
        })
      );

      const ship = await cartDao.getCartByIdAndUserId(
        userId,
        cartExist?.data?.cartId
      );
      const totalShippingCharge = ship?.data?.totalShippingCharge;
      const taxPrice = 0;
      const shippingPrice = Number(totalShippingCharge) || 0;
      console.log("shippingPrice", typeof shippingPrice);
      const totalPrice =
        orderItems.reduce((acc, item) => {
          return acc + item.reducedPrice * item.quantity;
        }, 0) +
        shippingPrice +
        taxPrice;

      console.log(totalPrice);
      const data = {
        shippingInfo: shippingInfo,
        orderItems: orderItems,
        user: userId,
        couponPrice: 0,
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
      };

      const result = await orderDao.createOrder(data);
      const session = await productPaymentHook(result.data);
      if (result.data) {
        return res.status(200).json({
          message: "order created successfully",
          success: "success",
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
      log.error("error from [ORDER SERVICE]: ", error);
      throw error;
    }
  }
  //getOrderHistoryService
  async getOrderHistoryService(req, res) {
    try {
      const userId = req.userId;
      const result = await orderDao.getAllUsersOrder(userId);
      console.log(result.data);
      if (result.data) {
        return res.status(200).json({
          message: "get order history successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "order history not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ORDER SERVICE]: ", error);
      throw error;
    }
  }

  //cancelOrderService
  async cancelOrderService(req, res) {
    try {
      const { orderId, orderItemId } = req.body;
      const userId = req.userId;
      console.log("sdfffffffffffff", orderItemId, orderId, userId);
      if (!userId || !orderId || !orderItemId) {
        return res.status(201).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isOrderExist = await orderDao.getOrderById(orderId);
      if (!isOrderExist.data) {
        return res.status(201).json({
          message: "order not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isOrderItemExist = await orderDao.getOrderItem(orderItemId);

      if (!isOrderItemExist.data) {
        return res.status(201).json({
          message: "order Item not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      if (isOrderItemExist.data.orderItemStatus === "cancel") {
        return res.status(201).json({
          message: "Your order has already been canceled",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const updateOrderItemStatus = await orderDao.updateOrderItemStatus(
        orderItemId
      );

      console.log("ssddddddddddddd", updateOrderItemStatus.data);

      return res.status(200).json({
        message: "order cancel successfully",
        status: "success",
        code: 200,
        data: updateOrderItemStatus.data,
      });
    } catch (error) {
      log.error("error from [ORDER SERVICE]: ", error);
      throw error;
    }
  }

  //getOrderService
  async getOrderService(req, res) {
    try {
      const userId = req.userId;
      const result = await orderDao.getAllOrder();
      console.log(result.data);
      if (result.data) {
        return res.status(200).json({
          message: "get order history successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "order history not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ORDER SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new OrderService();
