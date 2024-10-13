const log = require("../../configs/logger.config");
const productDao = require("../../daos/product.dao");
const categoryDao = require("../../daos/category.dao");
const subCategory = require("../../daos/subCategory.dao");
const subCategoryDao = require("../../daos/subCategory.dao");
const couponDao = require("../../daos/coupon.dao");
const contactUsDao = require("../../daos/contactUs.dao");
const { removeNullUndefined } = require("../../utils/helpers/common.utils");
class ProductService {
  async getAllProductService(req, res) {
    try {
      const {
        minPrice,
        maxPrice,
        categoryId,
        subCategoryId,
        keyWord,
        page = 1,
        limit = 9,
        sort,
      } = req.body;

      if (categoryId && subCategoryId) {
        const isCat = await categoryDao.getCategoryById(categoryId);
        if (!isCat.data) {
          return res.status(400).json({
            message: "category not found",
            success: "fail",
            code: 201,
          });
        }
        const isSubCat = await subCategoryDao.getSubCategoryById(subCategoryId);
        if (!isSubCat.data) {
          return res.status(400).json({
            message: "subcategory not found",
            success: "fail",
            code: 201,
          });
        }
        let result = null;
        if (minPrice && maxPrice) {
          result = await productDao.getProductOfCatAndSubCatBetweenPrice(
            categoryId,
            subCategoryId,
            minPrice,
            maxPrice,
            page,
            limit,
            sort
          );
          if (result.data) {
            return res.status(200).json({
              message: "products get successfully",
              success: "success",
              code: 200,
              data: result.data,
            });
          }
        }

        if (keyWord) {
          const result = await productDao.searchProByCatSubCatByKeyWord(
            categoryId,
            subCategoryId,
            keyWord,
            page,
            limit
          );
        }

        result = await productDao.getProductOfCatAndSubCat(
          categoryId,
          subCategoryId,
          page,
          limit
        );

        if (result.data) {
          return res.status(200).json({
            message: "products get successfully",
            success: "success",
            code: 200,
            data: result.data,
          });
        }
      }

      if (minPrice && maxPrice) {
        const result = await productDao.getProductBetweenPriceRange(
          minPrice,
          maxPrice,
          page,
          limit
        );
        if (result.data) {
          return res.status(200).json({
            message: "products get successfully",
            success: "success",
            code: 200,
            data: result.data,
          });
        }
      }

      if (keyWord) {
        const result = await productDao.searchProductByKeyWord(
          keyWord,
          page,
          limit
        );
        if (result.data) {
          return res.status(200).json({
            message: "products get successfully",
            success: "success",
            code: 200,
            data: result.data,
          });
        }
      }

      const result = await productDao.getAllProductWithRatingAndReview(
        page,
        limit
      );

      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }

  async getAllProductServiceNew(req, res) {
    try {
      const {
        minPrice,
        maxPrice,
        categoryId,
        subCategoryId,
        keyWord,
        page = 1,
        limit = 9,
        sort,
        barnId,
      } = req.body;
      
      const result = await productDao.getAllProductNew(
        minPrice,
        maxPrice,
        categoryId,
        subCategoryId,
        keyWord,
        page,
        limit,
        sort,
        barnId
      );
      console.log(result.data.length);
      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //getAllProductsBetweenPriceRangeService
  async getAllProductsBetweenPriceRangeService(req, res) {
    try {
      let { minPrice, maxPrice } = req.body;
      if (minPrice === 0) {
        minPrice = minPrice + 1;
      }
      if (!minPrice || !maxPrice) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await productDao.getProductBetweenPriceRange(
        minPrice,
        maxPrice
      );
      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //getAllProductsByCategoryService
  async getAllProductsByCategoryService(req, res) {
    try {
      const result = await productDao.getAllProductsByCategory();
      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //getProductByCategoryIdService
  async getProductByCategoryIdService(req, res) {
    try {
      const { categoryId } = req.body;
      if (!categoryId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await productDao.getAllProductsByCategoryId(categoryId);
      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //getProductByProductIdService
  async getProductByProductIdService(req, res) {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await productDao.getProductsByProductId(productId);

      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //searchProductByKeyWordService
  async searchProductByKeyWordService(req, res) {
    try {
      const { keyWord } = req.body;
      if (!keyWord) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await productDao.searchProductByKeyWord(keyWord);

      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //getSubCategoryByCategoryIdService
  async getSubCategoryByCategoryIdService(req, res) {
    try {
      const { categoryId } = req.body;

      if (!categoryId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await productDao.getSubCategoryByCategoryId(categoryId);

      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }

  //getSubCategoryProductBySubCategoryIdService
  async getSubCategoryProductBySubCategoryIdService(req, res) {
    try {
      const { subCategoryId } = req.body;
      console.log(subCategoryId);
      if (!subCategoryId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await productDao.getProductBySubCategoryId(subCategoryId);

      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }

  //getCategoryProductByCategoryIdService
  async getCategoryProductByCategoryIdService(req, res) {
    try {
      const { categoryId } = req.body;
      console.log(categoryId);
      if (!categoryId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await productDao.getProductByCategoryId(categoryId);

      if (result.data) {
        return res.status(200).json({
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //getCategoryAndSubCategoryService
  async getCategoryAndSubCategoryService(req, res) {
    try {
      const result = await productDao.getCategoryAndSubCategory();
      if (result.data) {
        return res.status(200).json({
          message: "category get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //getUserAllCouponService
  async getUserAllCouponService(req, res) {
    try {
      const userId = req.userId;
      console.log(userId);
      if (!userId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await couponDao.getCouponByUserId(userId);
      if (result.data) {
        return res.status(200).json({
          message: "coupon got successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "coupon not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }

  //contactUsService
  async contactUsService(req, res) {
    try {
      const { name, email, contact, query } = req.body;
      if (!name || !email || !contact || !query) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const data = {
        name,
        email,
        contact,
        query,
      };
      const result = await contactUsDao.contactUs(data);
      if (result.data) {
        return res.status(200).json({
          message: "your request has been received, and we will get in touch with you soon",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "failed to save detail",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [CONTACT US SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new ProductService();
