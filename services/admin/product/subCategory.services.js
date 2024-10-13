const log = require("../../../configs/logger.config");
const adminDao = require("../../../daos/admin.dao");
const barnDao = require("../../../daos/barn.dao");
const categoryDao = require("../../../daos/category.dao");
const subCategoryDao = require("../../../daos/subCategory.dao");
const { sendMail } = require("../../../utils/helpers/email.utils");
const { deleteS3Object } = require("../../../utils/helpers/files.helper");

class SubCategoryService {
  async addSubCategoryService(req, res) {
    try {
      const adminId = req.userId;
      const { name, categoryId, isActive } = req.body;
      console.log(req.file.location);
      console.log(name);
      if (
        !adminId ||
        !name ||
        !categoryId ||
        !isActive ||
        !req.file ||
        !req.file.location
      ) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      const isCatExist = await categoryDao.getCategoryById(categoryId);
      if (!isCatExist.data) {
        return res.status(201).json({
          message: "category not found",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const isExist = await subCategoryDao.getSubCategoryByName(name);
      console.log(isExist.data);
      if (isExist.data) {
        return res.status(201).json({
          message: "sub Category already exist",
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
        categoryId: categoryId,
        isActive: isActive,
        status,
        createdBy: parentId,
      };
      const adminDetail = await adminDao.getSuperAdmin();

      const result = await subCategoryDao.createSubCategory(data);
      if (result) {
        if (adminId !== "SUADMIN_1") {
          const response = await sendMail({
            email: adminDetail?.data?.email,
            subject: "new category request Arrived",
            emailData: {
              name,
            },
            emailType: "productSubCategoryRequest",
          });

          return res.status(200).json({
            message: "we have received your request",
            status: "success",
            code: 200,
          });
        }

        return res.status(200).json({
          message: "sub category created successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "sub category creation fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SUB CATEGORY SERVICE]: ", error);
      throw error;
    }
  }

  //update
  async updateSubCategoryByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { name, categoryId, subCategoryId, isActive, status } = req.body;
      if (!adminId || !subCategoryId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          data: null,
          code: 201,
        });
      }

      const isExist = await subCategoryDao.getSubCategoryById(subCategoryId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "sub category not found",
          status: "fail",
          data: null,
          code: 201,
        });
      }

      if (categoryId) {
        const isCatExist = await categoryDao.getCategoryById(categoryId);
        console.log(isCatExist);
        if (!isCatExist.data) {
          return res.status(400).json({
            message: "category not found",
            status: "fail",
            data: null,
            code: 201,
          });
        }
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
        name,
        image: newImage,
        categoryId,
        isActive,
        status,
      };
      const result = await subCategoryDao.updateSubCategory(
        subCategoryId,
        data
      );
      if (result) {
        return res.status(200).json({
          message: "sub category update successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "sub category update fail",
          status: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SUB CATEGORY SERVICE]: ", error);
      throw error;
    }
  }
  async deleteSubCategoryByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { subCategoryId } = req.body;
      console.log(adminId, subCategoryId);

      if (!adminId || !subCategoryId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const isExist = await subCategoryDao.getSubCategoryById(subCategoryId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "sub category not exist",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      const result = await subCategoryDao.deleteSubCategory(subCategoryId);
      await deleteS3Object(result.data.image);
      if (result.data) {
        return res.status(200).json({
          message: "subCategory deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "subCategory deletion fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SUBCATEGORY SERVICE]: ", error);
      throw error;
    }
  }
  async getSubCategoryByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { subCategoryId } = req.body;
      console.log(adminId, subCategoryId);
      if (!adminId || !subCategoryId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      let result = null;
      if (adminId === "SUADMIN_1") {
        result = await subCategoryDao.getSubCategoryById(subCategoryId);
      } else {
        result = await subCategoryDao.getSubcategoryForUserById(subCategoryId);
      }
      if (result.data) {
        return res.status(200).json({
          message: "sub category retrieved successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "sub category not found",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SUB CATEGORY SERVICE]: ", error);
      throw error;
    }
  }
  async getSubCategoriesForCategoryIdService(req, res) {
    try {
      const adminId = req.userId;
      const { categoryId } = req.body;
      console.log(categoryId);
      console.log(adminId);
      if (!adminId || !categoryId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      const isExistCat = await categoryDao.getCategoryForUserById(categoryId);
      if (!isExistCat.data) {
        return res.status(400).json({
          message: "category not exist",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      const result = await subCategoryDao.getSubCategoriesForCategoryId(
        categoryId
      );

      if (result.data) {
        return res.status(200).json({
          message: "subcategories retrieved successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "subcategories retrieved fail",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SUB CATEGORY SERVICE]: ", error);
      throw error;
    }
  }
  //getAllSubCategoryService
  async getAllSubCategoryService(req, res) {
    try {
      const adminId = req.userId;
      const { status } = req.body;
      console.log(adminId);
      if (!adminId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      let result = null;

      if (adminId === "SUADMIN_1") {
        result = await subCategoryDao.getAllSubCategory(status);
      } else {
        result = await subCategoryDao.getAllSubCategoryForUser();
      }

      if (result.data) {
        return res.status(200).json({
          message: "subcategories retrieved successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "subcategories retrieved fail",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SUB CATEGORY SERVICE]: ", error);
      throw error;
    }
  }

  //updateNewSubCategoryRequestService
  async updateNewSubCategoryRequestService(req, res) {
    try {
      const adminId = req.userId;
      const { subCategoryId, status, isActive } = req.body;
      console.log(adminId, subCategoryId, status);
      if (!adminId || !subCategoryId || !status || !isActive) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const subCategoryDetail = await subCategoryDao.getSubCategoryById(
        subCategoryId
      );

      if (!subCategoryDetail.data) {
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
      let result = await subCategoryDao.updateNewSubCategoryRequest(
        subCategoryId,
        updatedData
      );
      console.log("subcategory details", result.data);
      if (result.data) {
        const creatorId = result.data.createdBy;

        const owner = await adminDao.getById(creatorId);
        let subject;
        let emailType;

        subject =
          result.data.status === "accept"
            ? "SubCategory request Approved"
            : "SubCategory request canceled";
        emailType =
          result.data.status === "accept"
            ? "productSubCategoryAccept"
            : "productSubCategoryCancel";

        const response = await sendMail({
          email: owner?.data?.email,
          subject: subject,
          emailData: {
            name: result.data.name,
          },
          emailType: emailType,
        });

        return res.status(200).json({
          message: "subCategory status changed successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "subCategory not found",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SubCategory SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new SubCategoryService();
