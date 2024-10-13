const jobService = require("../../services/admin/job.services");
class JobController {
  async addJob(req, res) {
    try {
      const result = await jobService.addJobService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getJobById(req, res) {
    try {
      const result = await jobService.getJobByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllJob(req, res) {
    try {
      const result = await jobService.getAllJobService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateJobById(req, res) {
    try {
      const result = await jobService.updateJobByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteJobById(req, res) {
    try {
      const result = await jobService.deleteJobByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getJobByCategory
  async getJobByCategory(req, res) {
    try {
      const result = await jobService.getJobByCategoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new JobController();
