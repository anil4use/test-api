const log = require("../../configs/logger.config");
const orderDao = require("../../daos/order.dao");
const reviewAndWishDao = require("../../daos/reviewAndWish.dao");
const serviceReviewDao = require("../../daos/service.review.dao");
const userDao = require("../../daos/user.dao");
const {
  validateEmail,
  validateUSAMobileNumber,
  titleCase,
} = require("../../utils/helpers/validator.utils");

class ReviewAndWishListService {
  async addReviewOfProductService(req, res) {
    try {
      const { productId, description, rating } = req.body;
      const userId = req.userId;
      if (!productId || !rating || !description) {
        log.error("Error from [REVIEW SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "please enter all fields",
          success: "failed",
          data: null,
          code: 201,
        });
      }

      const isProductPurchase = await orderDao.getOrderByUserIdAnProductId(
        userId,
        productId
      );

      console.log("sdfffffffffff",isProductPurchase.data);
      if(!isProductPurchase.data){
        return res.status(404).json({
          message:"Please purchase this product first",
          success:"fail",
          code:201,
        })
      }

      const isReviewExist = await reviewAndWishDao.getReviewByProductId(
        productId,
        userId
      );

      console.log(isReviewExist.data);
      let result;
      const data = {
        userId: userId,
        rating: rating,
        description: description,
      };
      console.log(data);
      if (isReviewExist.data) {
        result = await reviewAndWishDao.updateTheReviewOfTheUser(
          productId,
          data
        );
      } else {
        result = await reviewAndWishDao.updateTheReviewOfTheUser(
          productId,
          data
        );
      }

      if (result.data) {
        return res.status(200).send({
          message: " review saved successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).send({
          message: " review save failed",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [REVIEWANDWISHLIST SERVICE]: ", error);
      throw error;
    }
  }

  async getReviewOfProductService(req, res) {
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
      const result = await reviewAndWishDao.getReviewByProduct(productId);
      let data = [];
      if (result.data) {
        data = await Promise.all(
          result.data.review.map(async (res) => {
            const userId = res.userId;
            const userDetail = await userDao.getUserById(userId);
            let user;
            if (userDetail.data) {
              if (userDetail.data) {
                user = `${userDetail.data.firstName} ${userDetail.data.lastName}`;
              } else {
                user = "barn";
              }
            }
            return {
              ...res.toObject(),
              name: user,
            };
          })
        );
      }
      return res.status(200).json({
        message: "reviews get successfully",
        success: "success",
        code: 200,
        data: data,
      });
    } catch (error) {
      log.error("error from [REVIEWANDWISHLIST SERVICE]: ", error);
      throw error;
    }
  }

  //addWishlistByProductIdService
  async addWishlistByProductIdService(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.userId;

      if (!productId || !userId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
        });
      }
      const isExistWishList = await reviewAndWishDao.getWishListByProductId(
        userId,
        productId
      );

      if (!isExistWishList.data) {
        const result = await reviewAndWishDao.updateWishList(userId, productId);
        console.log(result.data);
        if (result.data) {
          return res.status(200).json({
            message: " wishList Saved successfully",
            success: "success",
            code: 200,
            data: result.data,
          });
        } else {
          return res.status(201).json({
            message: " wishList Saved fail",
            success: "fail",
            code: 201,
          });
        }
      } else {
        return res.status(200).json({
          message: "product saved in wishlist successfully",
          success: "success",
          code: 200,
          data: isExistWishList.data,
        });
      }
    } catch (error) {
      log.error("error from [REVIEWANDWISHLIST SERVICE]: ", error);
      throw error;
    }
  }

  //getWishlistService
  async getWishlistService(req, res) {
    try {
      const {
        minPrice,
        maxPrice,
        categoryId,
        subCategoryId,
        keyWord,
        page,
        limit,
        sort,
      } = req.body;
      const userId = req.userId;

      console.log(req.body);

      if (!userId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await reviewAndWishDao.getWishList(
        userId,
        minPrice,
        maxPrice,
        categoryId,
        subCategoryId,
        keyWord,
        page,
        limit,
        sort
      );
      if (result.data) {
        return res.status(200).json({
          message: "wishList get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "wishList fail",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [REVIEWANDWISHLIST SERVICE]: ", error);
      throw error;
    }
  }
  //removeWishlistByProductIdService
  async removeWishlistByProductIdService(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.userId;

      if (!productId || !userId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
        });
      }
      const isExistWishList = await reviewAndWishDao.getWishListByProductId(
        userId,
        productId
      );

      if (!isExistWishList.data) {
        return res.status(400).json({
          message: "product not found",
          success: "fail",
          code: 201,
        });
      }

      const result = await reviewAndWishDao.removeProductFromWishList(
        userId,
        productId
      );
      if (result.data) {
        return res.status(200).json({
          message: "product remove from wishlist successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "product remove fail from wishlist",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [REVIEWANDWISHLIST SERVICE]: ", error);
      throw error;
    }
  }
  //service

  async addReviewOfService(req, res) {
    try {
      const { serviceId, description, rating } = req.body;
      const userId = req.userId;
      if (!serviceId || !rating || !description) {
        log.error(
          "Error from [SERVICE REVIEW SERVICES]: please enter all fields"
        );
        return res.status(400).json({
          message: "please enter all fields",
          success: "failed",
          data: null,
          code: 201,
        });
      }


      const isServicePurchase = await orderDao.getOrderByUserIdAndServiceId(
        userId,
        serviceId,
      );

      console.log("sdfffffffffff",isServicePurchase.data);
      if(!isServicePurchase.data){
        return res.status(404).json({
          message:"Please purchase this service first",
          success:"fail",
          code:201,
        })
      }

      const isReviewExist = await serviceReviewDao.getServiceReview(
        serviceId,
        userId
      );

      let result;
      const data = {
        userId: userId,
        rating: rating,
        description: description,
      };
      if (isReviewExist.data) {
        result = await serviceReviewDao.updateServiceReview(serviceId, data);
      } else {
        result = await serviceReviewDao.updateServiceReview(serviceId, data);
      }

      if (result.data) {
        return res.status(200).send({
          message: " review saved successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).send({
          message: " review save failed",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SERVICE REVIEW SERVICE]: ", error);
      throw error;
    }
  }

  async getReviewOfService(req, res) {
    try {
      const { serviceId } = req.body;
      if (!serviceId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }


      const result = await serviceReviewDao.getServiceByServiceId(serviceId);
      console.log(result.data);
      let data = [];
      if (result.data) {
        data = await Promise.all(
          result.data.review.map(async (res) => {
            const userId = res.userId;
            const userDetail = await userDao.getUserById(userId);
            let user;
            if (userDetail.data) {
              if (userDetail.data.firstName && userDetail.data.lastName) {
                user = `${userDetail?.data?.firstName} ${userDetail?.data?.lastName}`;
              } else {
                user = "barn";
              }
            }
            return {
              ...res.toObject(),
              name: user,
            };
          })
        );
      }
      return res.status(200).json({
        message: "service reviews get successfully",
        success: "success",
        code: 200,
        data: data,
      });
    } catch (error) {
      log.error("error from [SERVICE REVIEW SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new ReviewAndWishListService();
