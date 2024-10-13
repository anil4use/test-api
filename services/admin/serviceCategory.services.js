const log = require("../../configs/logger.config");
const serviceCategoryDao = require("../../daos/serviceCategory.dao");
const { deleteS3Object } = require("../../utils/helpers/files.helper");
const { validateEmail } = require("../../utils/helpers/validator.utils");

class ServiceServiceCategory {
  async addServiceCategoryServices(req, res) {
    try {
      const adminId = req.userId;
      console.log(adminId);
      const { name } = req.body;

      console.log(req.file);

      if (!adminId || !name || !req.file || !req.file.location) {
        log.error("Error from [SERVICE SERVICEANDCATEGORY]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const isExist = await serviceCategoryDao.getServiceByName(name);
      if (isExist.data) {
        return res.status(400).json({
          message: "name already exist",
          status: "fail",
          code: 201,
        });
      }


      let status = "pending";

      if (adminId === "SUADMIN_1") {
        status = "accept";
      }


      const data = {
        name,
        image: req.file.location,
        status
      };
      const result = await serviceCategoryDao.addServiceCategory(data);
      if (result.data) {

        if (adminId !== "SUADMIN_1") {
          const response = await sendMail({
            email: adminDetail?.data?.email,
            subject: "new category request Arrived",
            emailData: {
              name,
            },
            emailType: "serviceCategoryRequest",
          });
          return res.status(200).json({
            message: "we have received your request",
            status: "success",
            code: 200,
          });
        }

        return res.status(200).json({
          message: "service category creation successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "service category creation failed",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SERVICE SERVICES]: ", error);
      throw error;
    }
  }

  async getAllServiceCategoryServices(req, res) {
    try {
      const adminId = req.userId;
      const { status } = req.body;

      console.log(adminId);
      if (!adminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      let result = null;
      if (adminId === "SUADMIN_1") {
        result = await serviceCategoryDao.getAllServiceCategory(status);
      } else {
        result = await serviceCategoryDao.getAllServiceCategoryForUser();
      }
      if (result) {
        return res.status(200).json({
          message: "services retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "services not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [SERVICE SERVICE]: ", error);
      throw error;
    }
  }

  async getServiceCategoryByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { serviceCategoryId } = req.body;
      console.log(adminId);
      if (!adminId || !serviceCategoryId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      let result = null;

      if (adminId === "SUADMIN_1"){
        result = await serviceCategoryDao.getServiceCategoryById(serviceCategoryId);
      } else {
        result = await serviceCategoryDao.getServiceCategoryForUserById(serviceCategoryId);
      }

      if (result.data) {
        return res.status(200).json({
          message: "service retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "service not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [SERVICES SERVICE]: ", error);
      throw error;
    }
  }
  //updateServiceServices
  async updateServiceCategoryByIdServices(req, res) {
    try {
      const adminId = req.userId;
      const { name, isActive, serviceCategoryId ,status } = req.body;
      console.log(req.body);
      if (!adminId || !serviceCategoryId) {
        log.error("Error from [SERVICEANDCATEGORY SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "fail",
          code: 201,
        });
      }

      const isExist = await serviceCategoryDao.getServiceCategoryById(
        serviceCategoryId
      );
      if (!isExist.data) {
        return res.status(404).json({
          message: "service category not found",
          status: "fail",
          code: 201,
        });
      }
      let newImage;
      if (req.file && req.file.location) {
        if (isExist?.data && isExist?.data?.image) {
          await deleteS3Object(isExist?.data?.image);
        }
        newImage = req.file.location;
      } else {
        newImage = isExist?.data?.image;
      }
      
      const data = {
        name,
        image: newImage,
        isActive,
        status
      };

      const isExistName =
        await serviceCategoryDao.getServiceByNameNotThisServiceId(
          serviceCategoryId,
          name
        );

      if (isExistName.data) {
        return res.status(201).json({
          message: "service category name already exist",
          success: "fail",
          code: 201,
        });
      }

      const result = await serviceCategoryDao.updateServiceCategory(
        serviceCategoryId,
        data
      );

      console.log(result.data.image);
      if (result.data) {
        return res.status(200).json({
          message: "service category update successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "service category update failed",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SERVICEANDCATEGORY SERVICE]: ", error);
      throw error;
    }
  }
  //deleteServiceServices
  async deleteServiceCategoryServices(req, res) {
    try {
      const adminId = req.userId;
      const { serviceCategoryId } = req.body;
      console.log(adminId, serviceCategoryId);

      if (!adminId || !serviceCategoryId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const isExistServiceCategory =
        await serviceCategoryDao.getServiceCategoryById(serviceCategoryId);

      console.log(isExistServiceCategory.data);
      if (!isExistServiceCategory.data) {
        return res.status(201).json({
          message: "service category not found",
          success: "fail",
          code: 201,
        });
      }
      const result = await serviceCategoryDao.deleteServiceCategory(
        serviceCategoryId
      );
      if (result.data) {
        return res.status(200).json({
          message: "service category deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(404).json({
          message: "service category delete fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SERVICEANDCATEGORY SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new ServiceServiceCategory();
