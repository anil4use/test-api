const log = require("../configs/logger.config");
const serviceProvider = require("../models/serviceProvider");

class ServiceProviderDao {
  async getServiceProviderById(adminId) {
    try {
      const result = await serviceProvider.findOne({
        serviceProvider: adminId,
      });
      if (result) {
        return {
          message: "staff found successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
  //createServiceProvider
  async createServiceProvider(data) {
    try {
      const newServiceProvider = new serviceProvider(data);
      const result = await newServiceProvider.save();

      if (result) {
        return {
          message: "staff found successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }

  //updateServiceProvider
  async updateServiceProvider(providedBy, serviceId,action = 'add') {
    try {
      let updateQuery = {};
      if (action === "remove") {
        updateQuery = { $pull: { services: serviceId } };
      } else {
        updateQuery = { $push: { services: serviceId } };
      }
      const result = await serviceProvider.findByIdAndUpdate(
        providedBy,
        updateQuery,
        { new: true }
      );
      if (result) {
        return {
          message: "service update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new ServiceProviderDao();
