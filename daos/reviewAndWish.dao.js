const log = require("../configs/logger.config");
const reviewModel = require("../models/reviewandwishlist/review.model");
const wishListModel = require("../models/reviewandwishlist/wishlist.model");
const productModel = require("../models/product/product.model");

class Review {
  async getReviewByProductId(productId, userId) {
    try {
      console.log(productId, userId);
      const result = await reviewModel.findOne({
        productId: productId,
        review: {
          $elemMatch: {
            userId: userId,
          },
        },
      });
      console.log(result);
      if (result) {
        return {
          message: "review get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "review not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [REVIEWANDWISHLIST DAO] : ", error);
      throw error;
    }
  }

  async updateTheReviewOfTheUser(productId, data) {
    try {
      console.log(productId, data);
      const result = await reviewModel.findOneAndUpdate(
        {
          productId: productId,
          "review.userId": data.userId,
        },
        {
          $set: {
            "review.$": data,
          },
        },
        {
          new: true,
        }
      );

      if (!result) {
        const updatedResult = await reviewModel.findOneAndUpdate(
          { productId: productId },
          {
            $push: {
              review: data,
            },
          },
          {
            new: true,
            upsert: true,
          }
        );
        console.log(updatedResult);
        return {
          message: "review updated successfully",
          success: "success",
          code: 200,
          data: updatedResult,
        };
      } else {
        console.log(result);
        return {
          message: "review updated successfully",
          success: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [REVIEWANDWISHLIST DAO] : ", error);
      throw error;
    }
  }
  async getReviewByProduct(productId) {
    try {
      const result = await reviewModel.findOne({ productId }).sort({ _id: -1 });
      console.log(result);
      if (result) {
        return {
          message: "review get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "review not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [REVIEWANDWISHLIST DAO] : ", error);
      throw error;
    }
  }
  //getWishListByProductId
  async getWishListByProductId(userId, productId) {
    try {
      console.log(productId, userId);
      const result = await wishListModel.findOne({
        userId,
        wishList: {
          $in: productId,
        },
      });
      console.log(result);
      if (result) {
        return {
          message: "wishList get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "wishList not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [REVIEWANDWISHLIST DAO] : ", error);
      throw error;
    }
  }
  //updateWishList
  async updateWishList(userId, productId) {
    try {
      console.log(productId, userId);
      const result = await wishListModel.findOneAndUpdate(
        {
          userId: userId,
        },
        {
          $push: { wishList: productId },
        },
        {
          new: true,
          upsert: true,
        }
      );

      console.log(result);
      let response = [];
      if (result) {
        console.log("dsg");

        response = await Promise.all(
          result.wishList.map(async (data) => {
            console.log("dsg");
            const productId = data;
            const product = await productModel.findOne({ productId });
            let avgReview = await reviewModel.aggregate([
              {
                $match: { productId: productId },
              },
              {
                $unwind: "$review",
              },
              {
                $group: {
                  _id: "$productId",
                  averageRating: { $avg: "$review.rating" },
                  reviewCount: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  averageRating: 1,
                  reviewCount: 1,
                },
              },
            ]);
            //avgReview
            let avgRating = 0;
            let totalReview = 0;
            if (avgReview.length > 0) {
              product.avgRating = avgReview[0]?.averageRating
                ? avgReview[0]?.averageRating
                : 0;

              product.totalReview = avgReview[0]?.reviewCount
                ? avgReview[0]?.reviewCount
                : 0;
            }
            return {
              ...product.toObject(),
              avgRating: avgReview[0]?.averageRating
                ? avgReview[0]?.averageRating
                : 0,
              totalReview: avgReview[0]?.reviewCount
                ? avgReview[0]?.reviewCount
                : 0,
            };
          })
        );
        return {
          message: "wishList update successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "wishList update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [REVIEWANDWISHLIST DAO] : ", error);
      throw error;
    }
  }

  //getWishListNew
  async getWishList(
    userId,
    minPrice,
    maxPrice,
    categoryId,
    subCategoryId,
    keyWord,
    page,
    limit,
    sort
  ) {
    try {
      const result = await wishListModel.findOne({ userId: userId });
      let response = [];

      if (result && result.wishList.length > 0) {
        let wishList = result.wishList;

        // Retrieve product details
        let products = await productModel.find({
          productId: { $in: wishList },
        });

        // Apply category filters
        if (categoryId) {
          products = products.filter(
            (product) => product.categoryId == categoryId
          );
          if (subCategoryId) {
            products = products.filter(
              (product) => product.subCategoryId == subCategoryId
            );
          }
        }

        // Apply price filters
        if (minPrice !== undefined && maxPrice !== undefined) {
          products = products.filter(
            (product) => product.price >= minPrice && product.price <= maxPrice
          );
        }

        // Apply keyword search
        if (keyWord) {
          const regex = new RegExp(`.*${keyWord}.*`, "i");
          products = products.filter(
            (product) =>
              regex.test(product.name) ||
              regex.test(product.description) ||
              regex.test(product.feature)
          );
        }

        // Apply sorting
        if (sort === 1) {
          products.sort((a, b) => a.price - b.price);
        } else if (sort === -1) {
          products.sort((a, b) => b.price - a.price);
        }

        // Fetch reviews and calculate average ratings
        response = await Promise.all(
          products.map(async (product) => {
            let avgReview = await reviewModel.aggregate([
              { $match: { productId: product.productId } },
              { $unwind: "$review" },
              {
                $group: {
                  _id: "$productId",
                  averageRating: { $avg: "$review.rating" },
                  reviewCount: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  averageRating: 1,
                  reviewCount: 1,
                },
              },
            ]);

            return {
              ...product.toObject(),
              avgRating: avgReview[0]?.averageRating || 0,
              totalReview: avgReview[0]?.reviewCount || 0,
            };
          })
        );

        return {
          message: "Wishlist retrieved successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "Wishlist not found",
          success: "fail",
          code: 201,
          data: response,
        };
      }
    } catch (error) {
      log.error("Error from [REVIEWANDWISHLIST DAO] : ", error);
      throw error;
    }
  }

  //getWishList
  // async getWishList(
  //   userId,
  //   minPrice,
  //   maxPrice,
  //   categoryId,
  //   subCategoryId,
  //   keyWord,
  //   page,
  //   limit,
  //   sort
  // ) {
  //   try {
  //     // var filters = {};
  //     // if (categoryId) {
  //     //   filters.categoryId = categoryId;
  //     //   if (subCategoryId) {
  //     //     filters.subCategoryId = subCategoryId;
  //     //   }
  //     // }

  //     // // Filter by price range
  //     // if (minPrice !== undefined && maxPrice !== undefined) {
  //     //   filters.price = { $gte: minPrice, $lte: maxPrice };
  //     // }

  //     // // Filter by keyword
  //     // if (keyWord) {
  //     //   filters.$or = [
  //     //     { name: { $regex: `.*${keyWord}.*`, $options: "i" } },
  //     //     { description: { $regex: `.*${keyWord}.*`, $options: "i" } },
  //     //     { feature: { $regex: `.*${keyWord}.*`, $options: "i" } },
  //     //   ];
  //     // }
  //     // var dataToSort = {
  //     //   _id: -1,
  //     // };
  //     // if (sort) {
  //     //   dataToSort = {
  //     //     discountPrice: sort,
  //     //   };
  //     // }
  //     // const skip = (page - 1) * limit;

  //     const result = await wishListModel
  //     .findOne({ userId: userId })

  //     console.log(result);
  //     let response = [];
  //     if (result&&result.wishList.length > 0) {
  //       response = await Promise.all(
  //         result.wishList.map(async (data) => {
  //           const productId = data;
  //           console.log(productId)
  //           const product = await productModel.findOne({ productId });
  //           console.log(product);
  //           let avgReview = await reviewModel.aggregate([
  //             {
  //               $match: { productId: productId },
  //             },
  //             {
  //               $unwind: "$review",
  //             },
  //             {
  //               $group: {
  //                 _id: "$productId",
  //                 averageRating: { $avg: "$review.rating" },
  //                 reviewCount: { $sum: 1 },
  //               },
  //             },
  //             {
  //               $project: {
  //                 _id: 0,
  //                 averageRating: 1,
  //                 reviewCount: 1,
  //               },
  //             },
  //           ]);
  //           //avgReview
  //           let avgRating = 0;
  //           let totalReview = 0;
  //           if (avgReview.length > 0) {
  //             product.avgRating = avgReview[0]?.averageRating
  //               ? avgReview[0]?.averageRating
  //               : 0;

  //             product.totalReview = avgReview[0]?.reviewCount
  //               ? avgReview[0]?.reviewCount
  //               : 0;
  //           }

  //           return {
  //             ...product.toObject(),
  //             avgRating: avgReview[0]?.averageRating
  //               ? avgReview[0]?.averageRating
  //               : 0,
  //             totalReview: avgReview[0]?.reviewCount
  //               ? avgReview[0]?.reviewCount
  //               : 0,
  //           };
  //         })
  //       );

  //       console.log(response);
  //       return {
  //         message: "wishList get successfully",
  //         success: "success",
  //         code: 200,
  //         data: response,
  //       };
  //     } else {
  //       return {
  //         message: "wishList not found",
  //         success: "fail",
  //         code: 201,
  //         data: response,
  //       };
  //     }
  //   } catch (error) {
  //     log.error("Error from [REVIEWANDWISHLIST DAO] : ", error);
  //     throw error;
  //   }
  // }
  //removeProductFromWishList
  async removeProductFromWishList(userId, productId) {
    try {
      console.log(userId);
      const result = await wishListModel.findOneAndUpdate(
        { userId: userId },
        {
          $pull: { wishList: productId },
        },
        { new: true, upsert: true }
      );

      console.log(result);

      if (result) {
        return {
          message: "product remove from wishlist successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "wishList not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [REVIEWANDWISHLIST DAO] : ", error);
      throw error;
    }
  }

  //getProductOfCatAndSubCatBetweenPrice
  async getWishProductOfCatAndSubCatBetweenPrice(
    categoryId,
    subCategoryId,
    minPrice,
    maxPrice
  ) {
    try {
      console.log(userId);
      const page = 1;
      const limit = 9;
      const skip = (page - 1) * limit;

      const result = await wishListModel.findOne({ userId: userId });

      console.log(result);
      let response = [];
      if (result) {
        response = await Promise.all(
          result.wishList.map(async (data) => {
            const productId = data;
            const product = await productModel.findOne({ productId });
            let avgReview = await reviewModel.aggregate([
              {
                $match: { productId: productId },
              },
              {
                $unwind: "$review",
              },
              {
                $group: {
                  _id: "$productId",
                  averageRating: { $avg: "$review.rating" },
                  reviewCount: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  averageRating: 1,
                  reviewCount: 1,
                },
              },
            ]);
            //avgReview
            let avgRating = 0;
            let totalReview = 0;
            if (avgReview.length > 0) {
              product.avgRating = avgReview[0].averageRating;
              product.totalReview = avgReview[0].reviewCount;
            }
            return product;
          })
        );
        return {
          message: "wishList get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "wishList not found",
          success: "fail",
          code: 201,
          data: response,
        };
      }
    } catch (error) {
      log.error("Error from [REVIEWANDWISHLIST DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new Review();
