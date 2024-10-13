const productService = require("../../services/user/product.services");
class productController {
  async getAllProducts(req, res) {
    try {
      const result = await productService.getAllProductServiceNew(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getAllProductsBetweenPriceRange
  async getAllProductsBetweenPriceRange(req, res) {
    try {
      const result =
        await productService.getAllProductsBetweenPriceRangeService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getAllProductsByCategory

  async getAllProductsByCategory(req, res) {
    try {
      const result = await productService.getAllProductsByCategoryService(
        req,
        res
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getProductByCategoryId
  async getProductByCategoryId(req, res) {
    try {
      const result = await productService.getProductByCategoryIdService(
        req,
        res
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getProductByProductId
  async getProductByProductId(req, res) {
    try {
      const result = await productService.getProductByProductIdService(
        req,
        res
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  //searchProductByKeyWord
  async searchProductByKeyWord(req, res) {
    try {
      const result = await productService.searchProductByKeyWordService(
        req,
        res
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getSubCategoryByCategoryId

  async getSubCategoryByCategoryId(req, res) {
    try {
      const result = await productService.getSubCategoryByCategoryIdService(
        req,
        res
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getSubCategoryProductBySubCategoryId
  async getSubCategoryProductBySubCategoryId(req, res) {
    try {
      const result =
        await productService.getSubCategoryProductBySubCategoryIdService(
          req,
          res
        );
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getCategoryProductByCategoryId
  async getCategoryProductByCategoryId(req, res) {
    try {
      const result = await productService.getCategoryProductByCategoryIdService(
        req,
        res
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getCategoryAndSubCategory
  async getCategoryAndSubCategory(req, res) {
    try {
      const result = await productService.getCategoryAndSubCategoryService(
        req,
        res
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getUserAllCoupon
  async getUserAllCoupon(req, res) {
    try {
      const result = await productService.getUserAllCouponService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //contactUs

  async contactUs(req, res) {
    try {
      const result = await productService.contactUsService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }


}
module.exports = new productController();
