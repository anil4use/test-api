const getNextSequenceValue = require("../utils/helpers/counter.utils");
const log = require("../configs/logger.config");
const { titleCase } = require("../utils/helpers/common.utils");
const applicantModel = require("../models/job/applicantDetail.model");
class Applicant {
  //applyJob
  async applyJob(data) {
    try {
      data.firstName = titleCase(data.firstName);
      data.lastName = titleCase(data.lastName);
      const applicantId = "BCJA_" + (await getNextSequenceValue("applicant"));
      data.applicantId = applicantId;

      const applicantInfo = new applicantModel(data);
      const result = await applicantInfo.save();
      log.info("job applied successfully");
      if (result) {
        return {
          message: "job applied successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job applied fail",
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
  //getJobByEmailAndJobId

  async getJobByEmailAndJobId(jobId, email) {
    try {
      const result = await applicantModel.findOne({ jobId, email });
      log.info("applicant get successfully");
      if (result) {
        return {
          message: "applicant get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job applied fail",
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

  //getApplicantByEmail
  async getApplicantByEmail(email) {
    try {
      const result = await applicantModel.findOne({email});
      log.info("applicant get successfully");
      if (result) {
        return {
          message: "applicant get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "job applied fail",
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
}
module.exports = new Applicant();
