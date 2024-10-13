const log = require("../../configs/logger.config");
const jobDao = require("../../daos/job.dao");
const jobCategoryDao = require("../../daos/jobCategory.dao");
const {
  validateEmail,
  validateUSAMobileNumber,
} = require("../../utils/helpers/validator.utils");

class JobService {
  async addJobService(req, res) {
    try {
      const adminId = req.userId;
      const {
        jobCategoryId,
        name,
        description,
        location,
        salary,
        companyName,
        requiredSkills,
        employmentType,
        experienceLevel,
        applicationDeadline,
        postedDate,
        benefits,
        responsibilities,
        educationRequired,
        numberOfOpenings,
        jobType,
        isActive,
      } = req.body;
      console.log(req.body);
      if (
        !adminId ||
        !jobCategoryId ||
        !name ||
        !description ||
        !location ||
        !salary ||
        !companyName ||
        !requiredSkills ||
        !employmentType ||
        !experienceLevel ||
        !applicationDeadline ||
        !postedDate ||
        !benefits ||
        !responsibilities ||
        !educationRequired ||
        !numberOfOpenings ||
        !jobType ||
        !isActive
      ) {
        return res.status(201).json({
          message: "something went wrong",
          status: "fail",
          code: 200,
          data: null,
        });
      }

      const data = {
        jobCategoryId,
        name,
        description,
        location,
        salary,
        companyName,
        requiredSkills,
        employmentType,
        experienceLevel,
        applicationDeadline,
        postedDate,
        benefits,
        responsibilities,
        educationRequired,
        numberOfOpenings,
        jobType,
        isActive,
      };

      const result = await jobDao.addJob(data);
      if (result.data) {
        return res.status(200).json({
          message: "job created successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job creation failed",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [JOB SERVICE]: ", error);
      throw error;
    }
  }

  async getJobByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { jobId } = req.body;

      if (!adminId || !jobId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const isJobExist = await jobDao.getJobById(jobId);
      if (!isJobExist.data) {
        return res.status(400).json({
          message: "job not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await jobDao.getJobById(jobId);
      if (result.data) {
        return res.status(200).json({
          message: "job get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job not found",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [JOB SERVICE]: ", error);
      throw error;
    }
  }

  async getAllJobService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await jobDao.getAllJob();
      if (result.data) {
        return res.status(200).json({
          message: "job get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job not found failed",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [JOB SERVICE]: ", error);
      throw error;
    }
  }

  async updateJobByIdService(req, res) {
    try {
      const {
        jobId,
        jobCategoryId,
        name,
        description,
        location,
        salary,
        companyName,
        requiredSkills,
        employmentType,
        experienceLevel,
        applicationDeadline,
        postedDate,
        benefits,
        responsibilities,
        educationRequired,
        numberOfOpenings,
        jobType,
        isActive,
      } = req.body;
      console.log(req.body);
      if (!jobId || !jobCategoryId) {
        return res.status(201).json({
          message: "something went wrong",
          status: "fail",
          code: 200,
          data: null,
        });
      }

      const data = {
        jobCategoryId,
        name,
        description,
        location,
        salary,
        companyName,
        requiredSkills,
        employmentType,
        experienceLevel,
        applicationDeadline,
        postedDate,
        benefits,
        responsibilities,
        educationRequired,
        numberOfOpenings,
        jobType,
        isActive,
      };

      const isExist = await jobDao.getJobById(jobId);
      if (!isExist.data) {
        return res.status(200).json({
          message: "job not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await jobDao.updateJobById(jobId, data);
      if (result.data) {
        return res.status(200).json({
          message: "job created successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job creation failed",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [JOB SERVICE]: ", error);
      throw error;
    }
  }

  async deleteJobByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { jobId } = req.body;
      if (!adminId || !jobId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const isExist = await jobDao.getJobById(jobId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "job not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await jobDao.deleteJobById(jobId);
      if (result.data) {
        return res.status(200).json({
          message: "job deleted successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "job deletion failed",
          status: "failed",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [JOB SERVICE]: ", error);
      throw error;
    }
  }
  //getJobByCategoryService
  async getJobByCategoryService(req, res) {
    try {
      const adminId = req.userId;
      const { jobCategoryId } = req.body;
      if (!adminId || !jobCategoryId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const isExist = await jobCategoryDao.getJobCategoryById(jobCategoryId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "job category not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await jobCategoryDao.getJobCategoryById(jobCategoryId);
      if (result.data) {
        return res.status(200).json({
          message: "get job successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "job not found",
          status: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [JOB SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new JobService();
