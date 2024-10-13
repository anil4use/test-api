const log = require("../configs/logger.config");
const subCategoryModel = require("../models/product/subCategory.model");
const { titleCase } = require("../utils/helpers/common.utils");
const getNextSequenceValue = require("../utils/helpers/counter.utils");

class subCategory {
  async createSubCategory(data) {
    try {
      const subCategoryId =
        "BPSC_" + (await getNextSequenceValue("subCategory"));
      data.subCategoryId = subCategoryId;
      data.name = titleCase(data.name);

      const subCategoryInfo = new subCategoryModel(data);
      const result = await subCategoryInfo.save();
      log.info("subCategory saved");
      if (result) {
        return {
          message: "subCategory added successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [subCategory DAO] : subCategory creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [subCategory DAO] : ", error);
      throw error;
    }
  }
  //getSubCategoryByName
  async getSubCategoryByName(name) {
    try {
      const result = await subCategoryModel.findOne({
        name: titleCase(name).trim(),
      });
      console.log(result);
      if (result) {
        return {
          message: "subCategory found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subCategory not found",
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
  //getSubCategoryById
  async getSubCategoryById(subCategoryId) {
    try {
      const result = await subCategoryModel.findOne({ subCategoryId });
      console.log(result);
      if (result) {
        return {
          message: "subCategory found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subCategory not found",
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

  //getSubcategoryForUser

  async getSubcategoryForUserById(subCategoryId) {
    try {
      const result = await subCategoryModel.findOne({
        subCategoryId,
        status: "accept",
        isActive: true,
      });
      console.log(result);
      if (result) {
        return {
          message: "subCategory found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subCategory not found",
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

  //updateSubCategory
  async updateSubCategory(subCategoryId, data) {
    try {
      console.log(subCategoryId, data);
      data.name = titleCase(data.name);
      const result = await subCategoryModel.findOneAndUpdate(
        { subCategoryId: subCategoryId },
        data,
        {
          new: true,
        }
      );
      console.log(result);
      if (result) {
        return {
          message: "subCategory update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subCategory update fail",
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
  //deleteSubCategory
  async deleteSubCategory(subCategoryId) {
    try {
      const result = await subCategoryModel.findOneAndDelete({ subCategoryId });
      console.log(result);
      if (result) {
        return {
          message: "subCategory deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subCategory deletion fail",
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
  //getSubCategoriesForCategoryId
  async getSubCategoriesForCategoryId(categoryId) {
    try {
      const result = await subCategoryModel.find({
        categoryId,
        isActive: true,
        status: "accept",
      });

      console.log(result);
      let dataWithSeqNumbers;
      if (result) {
        if (result.length > 0) {
          dataWithSeqNumbers = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
          }));
        }
        console.log(dataWithSeqNumbers);
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

  //getAllSubCategoryForUser

  async getAllSubCategoryForUser() {
    try {
      const result = await subCategoryModel
        .find({ status: "accept", isActive: true })
        .populate([
          {
            path: "categoryId",
            localField: "categoryId",
            foreignField: "categoryId",
            select: "name categoryId",
          },
        ])
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
        console.log(dataWithSeqNumbers);
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

  //getAllSubCategory
  async getAllSubCategory(status) {
    try {
      let filter = {};

      if (status !== undefined) {
        filter.status = status;
      }

      const result = await subCategoryModel
        .find(filter)
        .populate([
          {
            path: "categoryId",
            localField: "categoryId",
            foreignField: "categoryId",
            select: "name categoryId",
          },
        ])
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
        console.log(dataWithSeqNumbers);
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

  //updateNewSubCategoryRequest
  async updateNewSubCategoryRequest(subCategoryId, data) {
    try {
      const result = await subCategoryModel.findOneAndUpdate(
        { subCategoryId: subCategoryId },
        data,
        {
          new: true,
        }
      );
      console.log(result);
      if (result) {
        return {
          message: "SubCategory status changed successfully",
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
module.exports = new subCategory();
