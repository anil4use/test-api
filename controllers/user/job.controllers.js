const jobService = require("../../services/user/job.services");
class JobController {
  async getJobDetails(req, res) {
    try {
      const result = await jobService.getJobDetailsService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getJobById
 // getJobById
 async getJobById(req, res) {
  try {
    const result = await jobService.getJobByIdService(req, res);
    return result;
  } catch (error) {
    throw error;
  }
}

//getAllJobCategory
async getAllJobCategory(req, res) {
  try {
    const result = await jobService.getAllJobCategoryService(req, res);
    return result;
  } catch (error) {
    throw error;
  }
}

  //applyForJob
  async applyForJob(req, res) {
    try {
      const result = await jobService.applyForJobService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new JobController();
