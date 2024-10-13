const subCategoryService = require("../../../services/admin/product/subCategory.services");
class SubCategoryController {
  async addSubCategory(req, res) {
    try {
      const result = await subCategoryService.addSubCategoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateSubCategoryById(req, res) {
    try {
      const result = await subCategoryService.updateSubCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteSubCategoryById(req, res) {
    try {
      const result = await subCategoryService.deleteSubCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getSubCategoryById(req, res) {
    try {
      const result = await subCategoryService.getSubCategoryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getSubCategoriesForCategoryId(req, res) {
    try {
      const result = await subCategoryService.getSubCategoriesForCategoryIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getAllSubCategory
  async getAllSubCategory(req, res) {
    try {
      const result = await subCategoryService.getAllSubCategoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //updateNewSubCategoryRequest
  async updateNewSubCategoryRequest(req, res) {
    try {
      const result = await subCategoryService.updateNewSubCategoryRequestService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new SubCategoryController();
