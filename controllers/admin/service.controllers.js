const serviceServices = require("../../services/admin/service.services");
class ServiceController {
  async addService(req, res) {
    try {
      const result = await serviceServices.addServiceServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async getAllServices(req, res) {
    try {
      const result = await serviceServices.getAllServiceServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getServiceById(req, res) {
    try {
      const result = await serviceServices.getServiceByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateService(req, res) {
    try {
      const result = await serviceServices.updateServiceServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteService(req, res) {
    try {
      const result = await serviceServices.deleteServiceServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getAllServiceEnquiry
  async getAllServiceEnquiry(req, res) {
    try {
      const result = await serviceServices.getAllServiceEnquiryServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //deleteServiceEnquiryById
  async deleteServiceEnquiryById(req, res) {
    try {
      const result = await serviceServices.deleteServiceEnquiryByIdServices(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new ServiceController();
