const log = require("../../configs/logger.config");
const adminDao = require("../../daos/admin.dao");
const jobCategoryDao = require("../../daos/jobCategory.dao");
const {
  validateEmail,
  validateUSAMobileNumber,
} = require("../../utils/helpers/validator.utils");

class JobService {
  async addJobCategoryService(req, res) {
    try {
      const adminId = req.userId;
      const { name, isActive } = req.body;

      if (!adminId || !name || !isActive) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isCatNameExist = await jobCategoryDao.getJobCategoryName(name);
      if (isCatNameExist.data) {
        return res.status(201).json({
          message: "job category name already exist",
          status: "fail",
          code: 201,
        });
      }

      let status = "pending";
      if (adminId === "SUADMIN_1") {
        status = "accept";
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
        name,
        isActive,
        status,
        createdBy: parentId,
      };

      const result = await jobCategoryDao.addJobCategory(data);
      if (result.data) {
        if (adminId !== "SUADMIN_1") {
          const response = await sendMail({
            email: adminDetail?.data?.email,
            subject: "new category request Arrived",
            emailData: {
              name,
            },
            emailType: "jobCategoryRequest",
          });

          return res.status(200).json({
            message: "we have received your request",
            status: "success",
            code: 200,
          });
        }

        return res.status(200).json({
          message: "job category created successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job category creation failed",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ADD JOB CATEGORY SERVICE]: ", error);
      throw error;
    }
  }

  async getJobCategoryByIdService(req, res) {
    try {
      const adminId = req.userId;
      console.log(adminId);
      const { jobCategoryId } = req.body;
      console.log(!adminId, !jobCategoryId);

      if (!adminId || !jobCategoryId) {
        return res.status(200).json({
          message: "something went wrong",
          status: "fail",
          code: 200,
          data: null,
        });
      }

      const isExist = await jobCategoryDao.getJobCategoryById(jobCategoryId);
      if (!isExist.data) {
        return res.status(200).json({
          message: "job category not found",
          status: "fail",
          code: 200,
          data: null,
        });
      }

      let result = null;
      if (adminId === "SUADMIN_1") {
        result = await jobCategoryDao.getJobCategoryById(jobCategoryId);
      } else {
        result = await jobCategoryDao.getJobCategoryForUserById(jobCategoryId);
      }

      if (result.data) {
        return res.status(200).json({
          message: "job category retrieved successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job category retrieved failed",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [JOB CATEGORY SERVICE]: ", error);
      throw error;
    }
  }

  async getAllJobCategoryService(req, res) {
    try {
      const adminId = req.userId;
      const { status } = req.body;

      if (!adminId) {
        return res.status(200).json({
          message: "something went wrong",
          status: "fail",
          code: 200,
          data: null,
        });
      }
      let result = null;
      if (adminId === "SUADMIN_1") {
        result = await jobCategoryDao.getallJobCategory(status);
      } else {
        result = await jobCategoryDao.getAllJobCategoryForUser();
      }
      if (result.data) {
        return res.status(200).json({
          message: "job categories retrieved successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job category retrieved failed",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ADD ADMIN SERVICE]: ", error);
      throw error;
    }
  }

  async updateJobCategoryByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { jobCategoryId, name, isActive, status } = req.body;
      if (!adminId || !jobCategoryId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isCatExist = await jobCategoryDao.getJobCategoryById(jobCategoryId);
      if (!isCatExist.data) {
        return res.status(400).json({
          message: "job category not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const data = {
        name,
        isActive,
        status,
      };
      const result = await jobCategoryDao.updateJobCategory(
        jobCategoryId,
        data
      );

      if (result.data) {
        return res.status(200).json({
          message: "job category updated successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job category update failed",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [JOB CATEGORY SERVICE]: ", error);
      throw error;
    }
  }

  async deleteJobCategoryByIdService(req, res) {
    try {
      const { jobCategoryId } = req.body;
      const adminId = req.userId;

      const isExist = await jobCategoryDao.getJobCategoryById(jobCategoryId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "job category not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await jobCategoryDao.deleteJobCategory(jobCategoryId);
      if (result.data) {
        return res.status(200).json({
          message: "job category deleted successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job category delete failed",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [JOB CATEGORY SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new JobService();
