const rentalProductService = require("../../services/user/rentalProduct.services");
class RentalProductController {
  async productOnRent(req, res) {
    try {
      const result = await rentalProductService.productOnRentService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //rentalOrderSummary
  async rentalOrderSummary(req, res) {
    try {
      const result = await rentalProductService.rentalOrderSummary(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //deleteRentalProduct
  async deleteRentalProduct(req, res) {
    try {
      const result = await rentalProductService.deleteRentalProduct(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  
}
module.exports = new RentalProductController();
