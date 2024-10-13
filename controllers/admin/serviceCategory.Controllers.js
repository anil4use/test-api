const serviceServicesCategory = require("../../services/admin/serviceCategory.services");
class ServiceCategoryController {
  async addServiceCategory(req, res) {
    try {
      const result = await serviceServicesCategory.addServiceCategoryServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async getAllServiceCategory(req, res) {
    try {
      const result = await serviceServicesCategory.getAllServiceCategoryServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getServiceCategoryById(req, res) {
    try {
      const result = await serviceServicesCategory.getServiceCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateServiceCategoryById(req, res) {
    try {
      const result = await serviceServicesCategory.updateServiceCategoryByIdServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteServiceCategoryById(req, res) {
    try {
      const result = await serviceServicesCategory.deleteServiceCategoryServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new ServiceCategoryController();
