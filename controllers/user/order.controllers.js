const PaymentHook = require("../../hook/payment");
const OrderService=require("../../services/user/order.services")
class OrderController {
  async createOrder(req, res) {
    try {
      const result = await OrderService.createOrderService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getOrderHistory
  async getOrderHistory(req, res) {
    try {
      const result = await OrderService.getOrderHistoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //cancelOrder
  async cancelOrder(req, res) {
    try {
      const result = await OrderService.cancelOrderService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getOrder
  async getOrder(req, res) {
    try {
      const result = await OrderService.getOrderService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

}
module.exports = new OrderController();
