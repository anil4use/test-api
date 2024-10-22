const orderModel = require("../models/order/order.model");
const userModel = require("../models/user.model");
const log = require("../configs/logger.config");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
const { removeNullUndefined } = require("../utils/helpers/common.utils");
const barnDao = require("./barn.dao");
const adminDao = require("./admin.dao");
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
              trackingNumber,
              orderItemStatus,
            } = item;

            const shouldIncludeTracking = ["product", "rentalProduct"].includes(
              order.orderType
            );
            return {
              name,
              originalPrice,
              discount,
              reducedPrice,
              quantity,
              coverImage,
              productId,
              trackingNumber: shouldIncludeTracking ? trackingNumber : null,
              deliveredAt: order.deliveredAt,
              orderStatus: order.orderStatus,
              totalPrice: reducedPrice * quantity,
              orderItemStatus: orderItemStatus,
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
        user: userId,
        orderItems: {
          $elemMatch: {
            product: productId,
          },
        },
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

  //getOrderByUserIdAndServiceId
  service;

  async getOrderByUserIdAndServiceId(userId, serviceId) {
    try {
      const result = await orderModel.findOne({
        user: userId,
        orderItems: {
          $elemMatch: {
            service: serviceId,
          },
        },
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

  //getAllOrder
  async getAllOrder() {
    try {
      const result = await orderModel.find({ orderStatus: "paid" });

      if (result) {
        return {
          message: "orders get successfully",
          success: "success",
          code: 200,
          data: result,
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

  async updateTrackingDetail(orderId, itemId, trackingNumber, level) {
    try {
      const result = await orderModel.findOneAndUpdate(
        { orderId: orderId, "orderItems._id": itemId },
        {
          $set: {
            "orderItems.$.trackingNumber": trackingNumber,
            "orderItems.$.level": level,
          },
        }
      );

      if (result) {
        return {
          message: "orders get successfully",
          success: "success",
          code: 200,
          data: result,
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
  //getOrderByTrackingAndProduct
  async getOrderByTrackingAndProduct(trackingId, productId) {
    try {
      console.log("trackingId", trackingId);
      console.log("productId", productId);

      const result = await orderModel.findOne({
        orderItems: {
          $elemMatch: {
            trackingNumber: trackingId,
            product: productId,
          },
        },
      });
      console.log("sdfsfs", result);

      if (result) {
        let ownerName;
        if (result?.orderItems[0].vendorId.startsWith("Barn_")) {
          const barnDetail = await barnDao.getBarnById(
            result?.orderItems[0].vendorId
          );
          ownerName = barnDetail?.data?.name;
        } else {
          const adminDetail = await adminDao.getById(result?.vendorId);
          ownerName = adminDetail?.data?.name;
        }

        const orderDetail = {
          productName: result?.orderItems[0]?.name,
          sender: ownerName,
          reducedPrice: result?.totalPrice,
          quantity: result?.orderItems[0]?.quantity,
          coverImage: result?.orderItems[0]?.coverImage,
          orderDate: result?.paidAt,
          orderId: result?.orderId,
          expectedDeliver: result.deliveredAt,
        };

        const recipientAddress = result?.shippingInfo;

        return {
          message: "orders get successfully",
          success: "success",
          code: 200,
          data: {
            orderDetail,
            recipientAddress,
          },
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

  //getOrderItem
  async getOrderItem(orderItemId) {
    try {
      const result = await orderModel.findOne(
        {
          orderItems: { $elemMatch: { _id: orderItemId } },
        },
        {
          "orderItems.$": 1,
        }
      );

      console.log("dsffffffffffffffffffff");
      if (result || result.orderItems || result.orderItems.length === 0) {
        return {
          message: "order get successfully",
          status: "success",
          code: 200,
          data: result.orderItems[0],
        };
      } else {
        return {
          message: "order not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ORDER DAO] : ", error);
      throw error;
    }
  }

  async updateOrderItemStatus(orderItemId) {
    try {
      const result = await orderModel.findOneAndUpdate(
        {
          "orderItems._id": orderItemId,
        },
        {
          $set: { "orderItems.$.orderItemStatus": "cancel" },
        },
        { new: true }
      );

      console.log("dsffffffffffffffffffff");
      if (result || result.orderItems || result.orderItems.length === 0) {
        return {
          message: "order get successfully",
          status: "success",
          code: 200,
          data: result.orderItems[0],
        };
      } else {
        return {
          message: "order not found",
          status: "fail",
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
