const log = require("../configs/logger.config");
const categoryModel = require("../models/product/category.model");
const { titleCase } = require("../utils/helpers/common.utils");
const getNextSequenceValue = require("../utils/helpers/counter.utils");

class Category {
  async createCategory(data) {
    try {
      const categoryId = "BPC_" + (await getNextSequenceValue("category"));
      data.categoryId = categoryId;
      data.name = titleCase(data.name);
      const categoryInfo = new categoryModel(data);
      const result = await categoryInfo.save();
      log.info("category saved");
      if (result) {
        return {
          message: "category added successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [CATEGORY DAO] : category creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //getCategoryByName
  async getCategoryByName(name) {
    try {
      const result = await categoryModel.findOne({
        name: titleCase(name),
      });
      console.log(result);
      if (result) {
        return {
          message: "category found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "category not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //getCategoryById
  async getCategoryById(categoryId) {
    try {
      const result = await categoryModel.findOne({ categoryId });
      if (result) {
        return {
          message: "category found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "category not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }

  //updateCategory
  async updateCategory(categoryId, data) {
    try {
      console.log(categoryId, data);
      if (data.name) {
        data.name = titleCase(data.name);
      }

      const result = await categoryModel.findOneAndUpdate(
        { categoryId: categoryId },
        data,
        {
          new: true,
        }
      );
      console.log(result);
      if (result) {
        return {
          message: "category update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "category update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //deleteCategory
  async deleteCategory(categoryId) {
    try {
      const result = await categoryModel.findOneAndDelete({ categoryId });
      console.log(result);
      if (result) {
        return {
          message: "category deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "category deletion fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //getAllCategory
  async getAllCategory(status) {
    try {
      let filter = {};

      if (status !== undefined) {
        filter.status = status;
      }

      const result = await categoryModel.find(filter).sort({ _id: -1 });

      console.log(result);
      let dataWithSeqNumbers;
      if (result) {
        if (result.length > 0) {
          dataWithSeqNumbers = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
          }));
        }

        return {
          message: "categories found",
          success: "success",
          code: 200,
          data: dataWithSeqNumbers === undefined ? [] : dataWithSeqNumbers,
        };
      } else {
        return {
          message: "categories not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  // getCategory
  async getCategoryForUserById(categoryId) {
    try {
      const result = await categoryModel.findOne({
        categoryId,
        status: "accept",
        isActive: true,
      });
      if (result) {
        return {
          message: "category found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "category not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }

  //for user
  async getAllCategoryForUser() {
    try {
      const result = await categoryModel
        .find({ status: "accept", isActive: true })
        .sort({ _id: -1 });

      console.log(result);
      let dataWithSeqNumbers;
      if (result) {
        if (result.length > 0) {
          dataWithSeqNumbers = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
          }));
        }

        return {
          message: "categories found",
          success: "success",
          code: 200,
          data: dataWithSeqNumbers === undefined ? [] : dataWithSeqNumbers,
        };
      } else {
        return {
          message: "categories not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  // /updateNewCategoryRequest
  async updateNewCategoryRequest(categoryId, data) {
    try {
      const result = await categoryModel.findOneAndUpdate(
        { categoryId: categoryId },
        data,
        {
          new: true,
        }
      );
      console.log(result);
      if (result) {
        return {
          message: "category status changed successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "category status change fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new Category();
