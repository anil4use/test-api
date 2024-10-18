const PaymentHook = require("../../hook/payment");
class PaymentController {
  async productWebHook(req, res) {
    try {
      const result = await PaymentHook.productWebHook(req, res);
      return result;
    } catch (error){
      throw error;
    }
  }

  //rentalProductWebHook
  async rentalProductWebHook(req, res) {
    try {
      const result = await PaymentHook.rentalProductWebHook(req, res);
      return result;
    } catch (error){
      throw error;
    }
  }

  async subscriptionWebHook(req, res) {
    try {
      const result = await PaymentHook.subscriptionPaymentWebHook(req, res);
      return result;
    } catch (error){
      throw error;
    }
  }

  //servicePaymentWebHook
  async servicePaymentWebHook(req, res) {
    try {
      const result = await PaymentHook.servicePaymentWebHook(req, res);
      return result;
    } catch (error){
      throw error;
    }
  }

  //rentalSpacePaymentWebHook
  async rentalSpacePaymentWebHook(req, res) {
    try {
      const result = await PaymentHook.rentalSpacePaymentWebHook(req, res);
      return result;
    } catch (error){
      throw error;
    }
  }

}
module.exports = new PaymentController();
