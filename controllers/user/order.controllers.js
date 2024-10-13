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
}
module.exports = new OrderController();
