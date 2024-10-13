const categoryService = require("../../../services/admin/product/category.services");
class CategoryController {
  async addCategory(req, res) {
    try {
      const result = await categoryService.addCategoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateCategoryById(req, res) {
    try {
      const result = await categoryService.updateCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteCategoryById(req, res) {
    try {
      const result = await categoryService.deleteCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getCategoryById(req, res) {
    try {
      const result = await categoryService.getCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAllCategory(req, res) {
    try {
      const result = await categoryService.getAllCategoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //updateNewCategoryRequest
  async updateNewCategoryRequest(req, res) {
    try {
      const result = await categoryService.updateNewCategoryRequestService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new CategoryController();
