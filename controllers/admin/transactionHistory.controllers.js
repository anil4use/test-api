const transactionService = require("../../services/admin/transactionHistory.services");
class TransactionHistoryController {


  async getTransaction(req, res) {
    try {
      const result = await transactionService.transactionHistoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //paymentHistoryForBarnRental
  async paymentHistoryForBarnRental(req, res) {
    try {

      const result = await transactionService.paymentHistoryForBarnRentalService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //paymentHistoryForServicePurchase
  async paymentHistoryForServicePurchase(req, res) {
    try {

      const result = await transactionService.paymentHistoryForServicePurchaseService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new TransactionHistoryController();
