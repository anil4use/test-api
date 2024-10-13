const orderModel = require("../models/order/order.model");
const userModel = require("../models/user.model");
const log = require("../configs/logger.config");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
const { removeNullUndefined } = require("../utils/helpers/common.utils");
class OrderDao {
  async createOrder(data) {
    try {
      const orderId = "Order_" + (await getNextSequenceValue("order"));
      data.orderId = orderId;
      const orderData = new orderModel(data);
      const result = await orderData.save();

      if (result) {
        return {
          message: "order created successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "order creation fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }
  //getOrderById
  async getOrderById(orderId) {
    try {
      console.log("orderIdddddddddddd......", orderId);
      const result = await orderModel.findOne({ orderId });
      console.log("ordertttttttttt", result);
      if (result) {
        return {
          message: "order get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "order not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }

  //updatedOrder

  async updatedOrder(orderId, data) {
    try {
      const result = await orderModel.findOneAndUpdate({ orderId }, data, {
        new: true,
      });

      if (result) {
        return {
          message: "order updated successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "order update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }
  //getAllUsersOrder
  // async getAllUsersOrder(userId) {
  //   try {
  //     const result = await orderModel.find({ user: userId }).sort({ _id: -1 }).select("orderItems deliveredAt");
  //     if (result) {
  //       return {
  //         message: "order get successfully",
  //         success: "success",
  //         code: 200,
  //         data: result,
  //       };
  //     } else {
  //       return {
  //         message: "order not found",
  //         success: "fail",
  //         code: 201,
  //         data: null,
  //       };
  //     }
  //   } catch (error) {
  //     log.error("Error from [ORDER DAO] : ", error);
  //     throw error;
  //   }
  // }

  async getAllUsersOrder(userId) {
    try {
      const result = await orderModel
        .find({ user: userId, orderStatus: "paid" })
        .sort({ _id: -1 });

      const allProducts = await Promise.all(
        result.map(async (order) => {
          const products = order.orderItems.map((item) => {
            const {
              name,
              originalPrice,
              discount,
              reducedPrice,
              quantity,
              coverImage,
              product: productId,
            } = item;
            return {
              name,
              originalPrice,
              discount,
              reducedPrice,
              quantity,
              coverImage,
              productId,
              deliveredAt: order.deliveredAt,
            };
          });
          return products;
        })
      );
      const products = allProducts.flat();

      if (result) {
        return {
          message: "order history successfully",
          status: "success",
          code: 200,
          data: products,
        };
      } else {
        return {
          message: "order not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }

  async getUserOrderByProduct(productId) {
    try {
      const result = await orderModel.findOne({ product: productId });
      if (result) {
        return {
          message: "order get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "order not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }

  //getOrderByUserIdAnProductId
  async getOrderByUserIdAnProductId(userId, productId) {
    try {
      const result = await orderModel.findOne({
        product: productId,
        user: userId,
      });
      if (result) {
        return {
          message: "order get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "order not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }

  //transaction
  // getAllTransaction
  async getAllTransaction() {
    try {
      const result = await orderModel
        .find({ orderStatus: "paid" })
        .select(
          "paymentId orderId orderStatus user couponPrice taxPrice shippingPrice totalPrice track paidAt deliveredAt isActive"
        )
        .sort({ _id: -1 });
      console.log(result);

      if (result) {
        let response = [];
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (item) => {
              const userId = item.user;
              const user = await userModel.findOne({ userId });
              let firstName = user?.firstName;
              let lastName = user?.lastName;
              let userName = null;

              if (firstName && lastName) {
                userName = `${firstName} ${lastName}`;
              }

              return {
                ...item.toObject(),
                userName: userName,
              };
            })
          );
        }
        return {
          message: "transaction get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "no transaction found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }
  //paymentHistoryForBarnRental
  async paymentHistoryForBarnRental() {
    try {
      const result = await orderModel
        .find({ orderStatus: "paid", orderType: "barnSpace" })
        .select(
          "paymentId orderId orderStatus orderItems user totalPrice paidAt isActive"
        )
        .sort({ _id: -1 });

      if (result) {
        let response = [];
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (item) => {
              const userId = item.user;
              const user = await userModel.findOne({ userId });
              let firstName = user?.firstName;
              let lastName = user?.lastName;
              let userName = null;

              if (firstName && lastName) {
                userName = `${firstName} ${lastName}`;
              }

              return {
                ...item.toObject(),
                userName: userName,
              };
            })
          );
        }
        return {
          message: "transaction get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "no transaction found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }

  async paymentHistoryForServicePurchase() {
    try {
      const result = await orderModel
        .find({ orderStatus: "paid", orderType: "service" })
        .select(
          "paymentId orderId orderStatus orderItems user totalPrice paidAt isActive"
        )
        .sort({ _id: -1 });

      if (result) {
        let response = [];
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (item) => {
              const userId = item.user;
              const user = await userModel.findOne({ userId });
              let firstName = user?.firstName;
              let lastName = user?.lastName;
              let userName = null;

              if (firstName && lastName) {
                userName = `${firstName} ${lastName}`;
              }

              return {
                ...item.toObject(),
                userName: userName,
              };
            })
          );
        }
        return {
          message: "transaction get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "no transaction found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new OrderDao();