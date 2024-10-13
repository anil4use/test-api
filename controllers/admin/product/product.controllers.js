const productService = require("../../../services/admin/product/product.services");
class ProductController {
  async addProduct(req, res) {
    try {
      const result = await productService.addProductService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //updateProductById
  async updateProductById(req, res) {
    try {
      const result = await productService.updateProductByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //deleteProductById
  async deleteProductById(req, res) {
    try {
      const result = await productService.deleteProductByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //get all product
  async deleteProductById(req, res) {
    try {
      const result = await productService.deleteProductByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getProductById
  async getProductById(req, res) {
    try {
      const result = await productService.getProductByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getAllProduct
  async getAllProduct(req, res) {
    try {
      const result = await productService.getAllProductService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //returnProduct
  async returnProduct(req, res) {
    try {
      const result = await productService.returnProductService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new ProductController();
