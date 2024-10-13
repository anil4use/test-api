const getNextSequenceValue = require("../utils/helpers/counter.utils");
const log = require("../configs/logger.config");
const jobCategoryModel = require("../models/job/jobCategory.model");
const { titleCase } = require("../utils/helpers/common.utils");

class JobCategoryDao {
  async addJobCategory(data) {
    try {
      const jobCategoryId = "BCJC_" + (await getNextSequenceValue("job"));
      data.jobCategoryId = jobCategoryId;
      data.name = titleCase(data.name);
      const jobIdInfo = new jobCategoryModel(data);
      const result = await jobIdInfo.save();
      log.info("job saved");
      if (result) {
        return {
          message: "job created successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [JOB DAO] : job creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [JOB DAO] : ", error);
      throw error;
    }
  }
  //getJobCategoryById
  async getJobCategoryById(jobCategoryId) {
    try {
      const result = await jobCategoryModel.findOne({ jobCategoryId });
      if (result) {
        return {
          message: "job category retrieved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job category not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB CATEGORY DAO] : ", error);
      throw error;
    }
  }
  async getJobCategoryForUserById(jobCategoryId) {
    try {
      const result = await jobCategoryModel.findOne({
        jobCategoryId,
        status: "accept",
        isActive: true,
      });

      if (result) {
        return {
          message: "job category retrieved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job category not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB CATEGORY DAO] : ", error);
      throw error;
    }
  }
  async updateJobCategory(jobCategoryId, data) {
    try {
      data.name = titleCase(data.name);
      const result = await jobCategoryModel.findOneAndUpdate(
        { jobCategoryId },
        data,
        { new: true }
      );
      log.info("job updated");
      if (result) {
        return {
          message: "job category updated successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job category update fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB CATEGORY DAO] : ", error);
      throw error;
    }
  }
  //deleteJobCategory
  async deleteJobCategory(jobCategoryId) {
    try {
      const result = await jobCategoryModel.findOneAndDelete({ jobCategoryId });
      log.info("category deleted");
      if (result) {
        return {
          message: "job category deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job category delete fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB CATEGORY DAO] : ", error);
      throw error;
    }
  }
  //getallJobCategory
  async getallJobCategory(status) {
    try {
      let filter = {};

      if (status === undefined) {
        status = "pending";
      }

      filter.status = status;

      const result = await jobCategoryModel.find(filter).sort({ _id: -1 });
      if (result) {
        return {
          message: "job category retrieved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job category not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB CATEGORY DAO] : ", error);
      throw error;
    }
  }

  //
  async getAllJobCategoryForUser(status) {
    try {
      const result = await jobCategoryModel
        .find({ status: "accept", isActive: true })
        .sort({ _id: -1 });
      if (result) {
        return {
          message: "job category retrieved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job category not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB CATEGORY DAO] : ", error);
      throw error;
    }
  }

  //getJobCategoryName
  async getJobCategoryName(name) {
    try {
      name = titleCase(name);
      const result = await jobCategoryModel.findOne({ name });
      if (result) {
        return {
          message: "job category retrieved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job category not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB CATEGORY DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new JobCategoryDao();
