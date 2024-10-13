const log = require("../../../configs/logger.config");
const adminDao = require("../../../daos/admin.dao");
const categoryDao = require("../../../daos/category.dao");
const { deleteS3Object } = require("../../../utils/helpers/files.helper");
const { sendMail } = require("../../../utils/helpers/email.utils");
const { removeNullUndefined } = require("../../../utils/helpers/common.utils");
const barnDao = require("../../../daos/barn.dao");
class CategoryService {
  async addCategoryService(req, res) {
    try {
      const adminId = req.userId;
      let { name, isActive } = req.body;
      if (!adminId || !name || !isActive || !req.file || !req.file.location) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const isExist = await categoryDao.getCategoryByName(name);
      console.log(isExist.data);
      if (isExist.data) {
        return res.status(201).json({
          message: "category already exist",
          success: "fail",
          code: 201,
        });
      }

      let status = "pending";
      isActive = false;

      if (adminId === "SUADMIN_1") {
        status = "accept";
        isActive = true;
      }

      let parentId = null;
      let parent = null;

      const isAdmin = await adminDao.getById(adminId);
      if (isAdmin.data?.adminType !== "BarnOwner") {
        if (isAdmin.data) {
          parentId = adminId;
        } else {
          return res.status(404).json({
            message: "admin not found",
            status: "fail",
            code: 201,
          });
        }
      } else {
        if (isAdmin.data.parentId) {
          parent = isAdmin.data.parentId;
        } else {
          parent = adminId;
        }
        const parentInfo = await barnDao.getBarnByBarnOwner(parent);
        if (parentInfo.data) {
          parentId = parentInfo.data.barnId;
        } else {
          return res.status(404).json({
            message: "admin not found",
            status: "fail",
            code: 201,
          });
        }
      }

      const data = {
        name: name,
        image: req.file.location,
        isActive,
        status,
        createdBy: parentId,
      };

      const adminDetail = await adminDao.getSuperAdmin();

      const result = await categoryDao.createCategory(data);
      if (result) {
        if (adminId !== "SUADMIN_1") {
          const response = await sendMail({
            email: adminDetail?.data?.email,
            subject: "new category request Arrived",
            emailData: {
              name,
            },
            emailType: "productCategoryRequest",
          });

          return res.status(200).json({
            message: "we have received your request",
            status: "success",
            code: 200,
          });
        }

        return res.status(200).json({
          message: "category created successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "category creation fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [CATEGORY SERVICE]: ", error);
      throw error;
    }
  }

  //update
  async updateCategoryByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { name, categoryId, isActive, status } = req.body;
      console.log(name);
      console.log(req.file?.location);
      if (!adminId || !categoryId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const isExist = await categoryDao.getCategoryById(categoryId);
      if (!isExist.data) {
        return res.status(404).json({
          message: "category not found",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      let newImage;
      if (req.file && req.file.location) {
        if (isExist.data && isExist.data.image) {
          await deleteS3Object(isExist.data.image);
        }
        newImage = req.file.location;
      } else {
        newImage = isExist.data.image;
      }
      console.log(newImage);
      const data = {
        name: name,
        image: newImage,
        isActive,
        status,
      };

      const result = await categoryDao.updateCategory(categoryId, data);
      if (result) {
        return res.status(200).json({
          message: "category update successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "category update fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [CATEGORY SERVICE]: ", error);
      throw error;
    }
  }
  async deleteCategoryByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { categoryId } = req.body;
      console.log(adminId, categoryId);

      if (!adminId || !categoryId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const isExist = await categoryDao.getCategoryById(categoryId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "category not exist",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const result = await categoryDao.deleteCategory(categoryId);
      await deleteS3Object(result.data.image);
      if (result.data) {
        return res.status(200).json({
          message: "category deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "category deletion fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [CATEGORY SERVICE]: ", error);
      throw error;
    }
  }
  async getCategoryByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { categoryId } = req.body;
      console.log(adminId, categoryId);
      if (!adminId || !categoryId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      let result = null;

      if (adminId === "SUADMIN_1") {
        result = await categoryDao.getCategoryById(categoryId);
      } else {
        result = await categoryDao.getCategoryForUserById(categoryId);
      }

      if (result.data) {
        return res.status(200).json({
          message: "category retrieved successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "category not found",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
  async getAllCategoryService(req, res) {
    try {
      const adminId = req.userId;
      console.log(adminId);
      const { status } = req.body;
      if (!adminId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      console.log(status);
      let result = null;
      if (adminId === "SUADMIN_1") {
        result = await categoryDao.getAllCategory(status);
      } else {
        result = await categoryDao.getAllCategoryForUser();
      }

      if (result.data) {
        return res.status(200).json({
          message: "categories retrieved successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "categories retrieved fail",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  //updateNewCategoryRequestService

  async updateNewCategoryRequestService(req, res) {
    try {
      const adminId = req.userId;
      const { categoryId, status, isActive } = req.body;
      console.log(adminId, categoryId, status);
      if (!adminId || !categoryId || !status || !isActive) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const categoryDetail = await categoryDao.getCategoryById(categoryId);

      if (!categoryDetail.data) {
        return res.status(400).json({
          message: "category not found",
          code: 201,
          status: "fail",
          data: null,
        });
      }

      const data = {
        status: status,
        isActive: isActive,
      };

      const updatedData = await removeNullUndefined(data);
      let result = await categoryDao.updateNewCategoryRequest(
        categoryId,
        updatedData
      );
      console.log("category details", result.data);
      if (result.data) {
        const creatorId = result.data.createdBy;

        const owner = await adminDao.getById(creatorId);
        let subject;
        let emailType;

        subject =
          result.data.status === "accept"
            ? "Category request Approved"
            : "Category request canceled";
        emailType =
          result.data.status === "accept"
            ? "productCategoryAccept"
            : "productCategoryCancel";

        const response = await sendMail({
          email: owner?.data?.email,
          subject: subject,
          emailData: {
            name: result.data.name,
          },
          emailType: emailType,
        });

        return res.status(200).json({
          message: "category status changed successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "category not found",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new CategoryService();
