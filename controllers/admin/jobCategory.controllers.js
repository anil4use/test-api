const jobCategoryService = require("../../services/admin/jobCategory.services");
class JobController {
  async addJobCategory(req, res) {
    try {
      const result = await jobCategoryService.addJobCategoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getJobCategoryById(req, res) {
    try {
      const result = await jobCategoryService.getJobCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllJobCategory(req, res) {
    try {
      const result = await jobCategoryService.getAllJobCategoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateJobCategoryById(req, res) {
    try {
      const result = await jobCategoryService.updateJobCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteJobCategoryById(req, res) {
    try {
      const result = await jobCategoryService.deleteJobCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new JobController();
