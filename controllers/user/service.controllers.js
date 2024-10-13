const service = require("../../services/user/service.services");
class ServiceController{
    async getAllService(req, res) {
        try {
          const result = await service.getAllServiceService(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }


      //getServiceByServiceId

      async getServiceByServiceId(req, res) {
        try {
          const result = await service.getServiceByServiceId(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }

      //serviceEnquiry
      async serviceEnquiry(req, res) {
        try {
          const result = await service.serviceEnquiryService(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }

      //getAllServiceCategory
      async getAllServiceCategory(req, res) {
        try {
          const result = await service.getAllServiceCategoryService(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }

      //createServiceOrder
      async createServiceOrder(req, res) {
        try {
          const result = await service.createServiceOrderService(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }

      //servicePurchaseSummary
      async servicePurchaseSummary(req, res) {
        try {
          const result = await service.servicePurchaseSummary(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }

      //deleteServicePurchaseSummary
      async deleteServicePurchaseSummary(req, res) {
        try {
          const result = await service.deleteServicePurchaseSummary(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }

}
module.exports=new ServiceController();