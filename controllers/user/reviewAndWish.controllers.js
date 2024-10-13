const reviewAndWishListService = require("../../services/user/reviewAndWish.services");
class ReviewAndWishListController {
  async addReviewOfProduct(req, res) {
    try {
      const result = await reviewAndWishListService.addReviewOfProductService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getReviewOfProduct(req, res) {
    try {
      const result = await reviewAndWishListService.getReviewOfProductService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //addWishlistByProductId
  async addWishlistByProductId(req, res) {
    try {
      const result = await reviewAndWishListService.addWishlistByProductIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getWishlist
  async getWishlist(req, res) {
    try {
      const result = await reviewAndWishListService.getWishlistService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //removeWishlistByProductId
  async removeWishlistByProductId(req, res) {
    try {
      const result = await reviewAndWishListService.removeWishlistByProductIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }


//service 
  async addReviewOfService(req, res) {
    try {
      const result = await reviewAndWishListService.addReviewOfService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getReviewOfService(req, res) {
    try {
      const result = await reviewAndWishListService.getReviewOfService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}



module.exports = new ReviewAndWishListController();
