const getNextSequenceValue = require("../utils/helpers/counter.utils");
const log = require("../configs/logger.config");
const jobModel = require("../models/job/job.model");
const { titleCase } = require("../utils/helpers/common.utils");
const applicantModel = require("../models/job/applicantDetail.model");

class JobDao {
  async addJob(data) {
    try {
      data.name = titleCase(data.name);
      const jobId = "Job_" + (await getNextSequenceValue("job"));
      data.jobId = jobId;

      const jobIdInfo = new jobModel(data);
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
  //getJobById

  async getJobById(jobId) {
    try {
      const result = await jobModel.findOne({ jobId });
      log.info("job get successfully");
      if (result) {
        return {
          message: "job get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB DAO] : ", error);
      throw error;
    }
  }
  //getAllJob
  async getAllJob() {
    try {
      const result = await jobModel.find().sort({ _id: -1 });
      log.info("job get successfully");
      if (result) {
        return {
          message: "job get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job not found",
          status: "success",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB DAO] : ", error);
      throw error;
    }
  }
  //updateJobById
  async updateJobById(jobId, data) {
    try {
      const result = await jobModel.findOneAndUpdate({ jobId }, data, {
        new: true,
      });
      log.info("job update successfully");
      if (result) {
        return {
          message: "job updated successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job not found",
          status: "fail",
          code: 200,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB DAO] : ", error);
      throw error;
    }
  }
  //deleteJobById
  async deleteJobById(jobId) {
    try {
      const result = await jobModel.findOneAndDelete({ jobId });
      log.info("job deleted successfully");
      if (result) {
        return {
          message: "job deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job deletion fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB DAO] : ", error);
      throw error;
    }
  }

  //getAllJobForUser
  async getAllJobForUser(
    jobId,
    name,
    location,
    jobType,
    employmentType,
    experienceLevel,
    jobCategoryId,
    keyWord,
    lastDate,
    page,
    limit,
    sort
  ) {
    try {
      var filters = {};
      if (jobCategoryId) {
        filters.jobCategoryId = jobCategoryId;
      }

      if (lastDate) {
        const now = new Date();
        let lastDateFilter;

        switch (lastDate) {
          case "24h":
            lastDateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case "3d":
            lastDateFilter = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
            break;
          case "7d":
            lastDateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          default:
            lastDateFilter = null;
        }

        if (lastDateFilter) {
          filters.postedDate = { $gte: lastDateFilter };
        }
      }

      if (name) {
        filters.name = name;
      }

      if (jobId) {
        filters.jobId = jobId;
      }
      if (location) {
        filters.location = { $regex: `.*${location}.*`, $options: "i" };
      }
      if (jobType) {
        filters.jobType = jobType;
      }
      if (employmentType) {
        filters.employmentType = employmentType;
      }

      if (experienceLevel) {
        filters.experienceLevel = experienceLevel;
      }

      if (keyWord) {
        filters = { name: { $regex: `.*${keyWord}.*`, $options: "i" } };
      }

      var dataToSort = {
        _id: -1,
      };
      if (sort) {
        dataToSort = {
          postedDate: sort,
        };
      }
      const skip = (page - 1) * limit;

      const result = await jobModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .sort(dataToSort);

      // .populate([
      //   {
      //     path: "jobCategoryId",
      //     localField: "JobCategory",
      //     foreignField: "jobCategoryId",
      //     select: "name jobCategoryId",
      //   },
      // ])

      log.info("job get successfully");
      if (result) {
        return {
          message: "job get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job not found",
          status: "success",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [JOB DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new JobDao();
