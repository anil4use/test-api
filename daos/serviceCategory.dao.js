const log = require("../configs/logger.config");
const serviceCategoryModel = require("../models/service/serviceCategory.model");
const { titleCase } = require("../utils/helpers/common.utils");

const getNextSequenceValue = require("../utils/helpers/counter.utils");

class ServiceCategoryDao {
  async addServiceCategory(data) {
    try {
      const serviceCategoryId =
        "BCSC_" + (await getNextSequenceValue("serviceCategory"));
      data.serviceCategoryId = serviceCategoryId;
      data.name = titleCase(data.name);

      const serviceCategoryInfo = new serviceCategoryModel(data);
      const result = await serviceCategoryInfo.save();
      log.info("serviceCategory saved");
      if (result) {
        return {
          message: "serviceCategory added successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error(
          "Error from [SERVICEANDCATEGORY DAO] : serviceCategory creation error"
        );
        throw error;
      }
    } catch (error) {
      log.error("Error from [SERVICEANDCATEGORY DAO] : ", error);
      throw error;
    }
  }
  //getAllServiceForUser
  //getAllServiceCategoryForUser

  async getAllServiceCategoryForUser() {
    try {
      const result = await serviceCategoryModel
        .find({ status: "accept", isActive: true })
        .sort({ _id: -1 });

      let dataWithSeqNumbers;
      if (result) {
        if (result.length > 0) {
          dataWithSeqNumbers = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
          }));
        }
        return {
          message: "services category retrieved successfully",
          success: "success",
          code: 200,
          data: (dataWithSeqNumbers = dataWithSeqNumbers
            ? dataWithSeqNumbers
            : []),
        };
      }
    } catch (error) {
      log.error("Error from [SERVICEANDCATEGORY DAO] : ", error);
      throw error;
    }
  }

  async getAllServiceCategory(status) {
    try {
      console.log(status);
      let filter = {};

      if (status !== undefined) {
        filter.status = status;
      }

      const result = await serviceCategoryModel
        .find( filter )
        .sort({ _id: -1 });
      let dataWithSeqNumbers;
      console.log("result..........",result);
      if (result) {
        if (result.length > 0) {
          dataWithSeqNumbers = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
          }));
        }
        return {
          message: "services category retrieved successfully",
          success: "success",
          code: 200,
           data:
          (dataWithSeqNumbers = dataWithSeqNumbers
            ? dataWithSeqNumbers
            : []),
        };
      }
    } catch (error) {
      log.error("Error from [SERVICEANDCATEGORY DAO] : ", error);
      throw error;
    }
  }
  //
  async getServiceCategoryById(serviceCategoryId) {
    try {
      const result = await serviceCategoryModel.findOne({ serviceCategoryId });
      if (result) {
        return {
          message: "service category retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service category not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICEANDCATEGORY DAO] : ", error);
      throw error;
    }
  }

  //getCategoryForUseByIdForUser
  async getServiceCategoryForUserById(serviceCategoryId) {
    try {
      const result = await serviceCategoryModel.findOne({
        serviceCategoryId,
        status: "accept",
        isActive: true,
      });
      if (result) {
        return {
          message: "service category retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service category not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICEANDCATEGORY DAO] : ", error);
      throw error;
    }
  }

  //updateServiceCategory
  async updateServiceCategory(serviceCategoryId, data) {
    try {
      console.log(serviceCategoryId, data);
      if (data.name) {
        data.name = titleCase(data.name);
      }
      const result = await serviceCategoryModel.findOneAndUpdate(
        { serviceCategoryId: serviceCategoryId },
        data,
        {
          new: true,
        }
      );
      console.log(result);

      if (result) {
        return {
          message: "service category update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service category update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //deleteServiceCategory
  async deleteServiceCategory(serviceCategoryId) {
    try {
      const result = await serviceCategoryModel.findOneAndDelete({
        serviceCategoryId,
      });
      if (result) {
        return {
          message: "service category deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service category not deleted",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICEANDCATEGORY DAO] : ", error);
      throw error;
    }
  }
  //getServiceByName
  async getServiceByName(name) {
    try {
      const result = await serviceCategoryModel.findOne({
        name: name,
      });
      if (result) {
        return {
          message: "service category found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service category not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICEANDCATEGORY DAO] : ", error);
      throw error;
    }
  }

  async getServiceByNameNotThisServiceId(serviceCategoryId, name) {
    try {
      name = titleCase(name);
      const result = await serviceCategoryModel.findOne({
        serviceCategoryId: { $ne: serviceCategoryId },
        name: name,
      });
      if (result) {
        return {
          message: "service category found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service category not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICEANDCATEGORY DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new ServiceCategoryDao();
