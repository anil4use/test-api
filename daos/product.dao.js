const log = require("../configs/logger.config");
const productModel = require("../models/product/product.model");
const reviewModel = require("../models/reviewandwishlist/review.model");
const { titleCase } = require("../utils/helpers/common.utils");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
const categoryModel = require("../models/product/category.model");
const subCategoryModel = require("../models/product/subCategory.model");
const adminDao = require("./admin.dao");
const barnDao = require("./barn.dao");

class Product {
  async createProduct(data) {
    try {
      const productId = "BP_" + (await getNextSequenceValue("product"));
      data.productId = productId;
      data.name = titleCase(data.name);
      const productInfo = new productModel(data);
      const result = await productInfo.save();
      log.info("product saved");
      if (result) {
        return {
          message: "product added successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [PRODUCT DAO] : product creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getProductByName
  async getProductByName(name) {
    try {
      const result = await productModel.findOne({
        name: titleCase(name).trim(),
      });
      console.log(result);
      if (result) {
        return {
          message: "product found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getProductById
  async getProductById(productId) {
    try {
      const result = await productModel.findOne({ productId });
      console.log(result);
      if (result) {
        return {
          message: "product found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getProductCatSubCatDetailsById
  async getProductCatSubCatDetailsById(productId) {
    try {
      const result = await productModel.findOne({ productId }).populate([
        {
          path: "categoryId",
          localField: "categoryId",
          foreignField: "categoryId",
        },
        {
          path: "subCategoryId",
          localField: "subCategoryId",
          foreignField: "subCategoryId",
        },
      ]);
      console.log(result);
      if (result) {
        return {
          message: "product found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //updateProduct
  async updateProduct(productId, data) {
    try {
      console.log(productId, data);
      if (data.name) {
        data.name = titleCase(data.name);
      }
      const result = await productModel.findOneAndUpdate(
        { productId: productId },
        data,
        {
          new: true,
        }
      );
      console.log(result);
      if (result) {
        return {
          message: "product update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "product update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //deleteProduct
  async deleteProduct(productId) {
    try {
      const result = await productModel.findOneAndDelete({ productId });
      console.log(result);
      if (result) {
        return {
          message: "Product deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "Product deletion fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getAllProduct
  async getAllProduct() {
    try {
      const result = await productModel
        .find({ isActive: true })
        .sort({ _id: -1 })
        .populate([
          {
            path: "categoryId",
            localField: "categoryId",
            foreignField: "categoryId",
            select: "name categoryId",
          },
          {
            path: "subCategoryId",
            localField: "subCategoryId",
            foreignField: "subCategoryId",
            select: "name subCategoryId",
          },
        ]);
      console.log(result);
      let dataWithSeqNumbers;

      if (result) {
        dataWithSeqNumbers = result.map((entry, index) => ({
          seqNumber: index + 1,
          ...entry.toObject(),
        }));
        return {
          message: "products found",
          success: "success",
          code: 200,
          data: dataWithSeqNumbers === undefined ? [] : dataWithSeqNumbers,
        };
      } else {
        return {
          message: "products not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }

  async getAllProductNew(
    minPrice,
    maxPrice,
    categoryId,
    subCategoryId,
    keyWord,
    page,
    limit,
    sort,
    barnId
  ) {
    try {
      var filters = {};
      if (categoryId) {
        filters.categoryId = categoryId;
      }

      if (subCategoryId) {
        filters.subCategoryId = subCategoryId;
      }

      // Filter by price range
      if (minPrice && maxPrice) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }

      // Filter by keyword
      if (keyWord) {
        filters.$or = [
          { name: { $regex: `.*${keyWord}.*`, $options: "i" } },
          { description: { $regex: `.*${keyWord}.*`, $options: "i" } },
          { feature: { $regex: `.*${keyWord}.*`, $options: "i" } },
        ];
      }

      console.log(barnId);
      if (barnId) {
        filters.ownedBy = barnId;
      }
      console.log("dsga", filters);

      var dataToSort = {
        _id: -1,
      };

      if (sort) {
        dataToSort = {
          discountPrice: sort,
        };
      }
      const skip = (page - 1) * limit;
      const result = await productModel
        .find(filters)
        .where({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort(dataToSort)
        .populate([
          {
            path: "categoryId",
            localField: "categoryId",
            foreignField: "categoryId",
            select: "name categoryId",
          },
          {
            path: "subCategoryId",
            localField: "subCategoryId",
            foreignField: "subCategoryId",
            select: "name subCategoryId",
          },
        ]);
      let dataWithSeqNumbers;

      if (result) {
        let response = [];
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const productId = data.productId;
              const product = await reviewModel.findOne({ productId });
              let avgRating = 0;
              let totalReview = 0;
              let ownedBy = null;
              if (product) {
                avgRating =
                  product.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product.review.length;
                totalReview = product.review.length;
                ownedBy = product.ownedBy;
              }
              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                ownedBy: ownedBy,
                avgRating: avgRating,
                reviewTotal: totalReview,
              };
            })
          );
        }
        return {
          message: "products found",
          success: "success",
          code: 200,
          data: response,
          //dataWithSeqNumbers === undefined ? [] : dataWithSeqNumbers,
        };
      } else {
        return {
          message: "products not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getProductNotFromThisIdByName
  async getProductNotFromThisIdByName(productId, name) {
    try {
      console.log(productId, name);
      const result = await productModel.findOne({
        name: titleCase(name),
        productId: { $ne: productId },
      });
      console.log(result);
      if (result) {
        return {
          message: "product found",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getAllProductWithRatingAndReview
  async getAllProductWithRatingAndReview(page, limit) {
    try {
      const skip = (page - 1) * limit;
      const result = await productModel
        .find({ isActive: true })
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 });
      console.log(result);

      if (result) {
        let response = [];
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const productId = data.productId;
              const product = await reviewModel.findOne({ productId });
              let avgRating = 0;
              let totalReview = 0;
              if (product) {
                avgRating =
                  product.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product.review.length;
                totalReview = product.review.length;
              }
              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                AvgRating: avgRating,
                ReviewTotal: totalReview,
              };
            })
          );
        }
        console.log(response);
        return {
          message: "products found",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "products not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getProductBetweenPriceRange
  async getProductBetweenPriceRange(minPrice, maxPrice, page, limit) {
    try {
      var filters = {};
      if (minPrice && maxPrice) {
        filters["price"] = { $gte: minPrice, $lte: maxPrice };
      }

      if (categoryId) {
        filters["categoryId"] = categoryId;
      }
      const skip = (page - 1) * limit;

      const result = await productModel
        .find({ price: { $gte: minPrice, $lte: maxPrice } })
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 });
      console.log(result);
      if (result) {
        let response = [];
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const productId = data.productId;
              const product = await reviewModel.findOne({ productId });
              let avgRating = 0;
              let totalReview = 0;
              if (product) {
                avgRating =
                  product.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product.review.length;
                totalReview = product.review.length;
              }
              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                AvgRating: avgRating,
                ReviewTotal: totalReview,
              };
            })
          );
        }
        console.log(response);
        return {
          message: "products found",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "products not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getAllProductsByCategory
  async getAllProductsByCategory() {
    try {
      const result = await categoryModel
        .find({ isActive: true })
        .sort({ name: 1 });
      let response = [];
      if (result) {
        response = await Promise.all(
          result.map(async (data, index) => {
            const seqNumber = index + 1;
            const count = await productModel
              .find({ categoryId: data.categoryId })
              .count();
            return {
              seqNumber: seqNumber,
              ...data.toObject(),
              count: count,
            };
          })
        );

        return {
          message: "product get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "product not found",
          success: "success",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getAllProductsByCategoryId
  async getAllProductsByCategoryId(categoryId) {
    try {
      const result = await productModel
        .find({ categoryId: categoryId, isActive: true, quantity: { $gte: 0 } })
        .sort({ id_: 1 });

      let response = [];
      if (result) {
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const productId = data.productId;
              const product = await reviewModel.findOne({
                productId: productId,
              });

              let avgRating = 0;
              let totalReview = 0;
              console.log(product);
              if (product) {
                avgRating =
                  product.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product.review.length;
                totalReview = product.review.length;
              }
              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                avgRating: avgRating,
                totalReview: totalReview,
              };
            })
          );
        }
        return {
          message: "product get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "product not found",
          success: "success",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getProductsByProductIdWithCatSubCatAndRating
  async getProductsByProductId(productId) {
    try {
      const result = await productModel
        .findOne({ productId })
        .populate([
          {
            path: "categoryId",
            localField: "categoryId",
            foreignField: "categoryId",
            select: "categoryId name image",
          },
          {
            path: "subCategoryId",
            localField: "subCategoryId",
            foreignField: "subCategoryId",
            select: "subCategoryId name image",
          },
        ])
        .sort({ _id: -1 });

      console.log(result);
      let ratingPer = {};
      if (result) {
        const product = await reviewModel.findOne({ productId });
        let ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let avgRating = 0;
        let totalReview = 0;

        if (product) {
          avgRating =
            product.review.reduce((acc, review) => acc + review.rating, 0) /
            product.review.length;
          totalReview = product.review.length;
          product.review.forEach((review) => {
            ratingCounts[review.rating]++;
          });
          for (let rating in ratingCounts) {
            ratingPer[rating] = (ratingCounts[rating] / totalReview) * 100;
          }
        }
        const response = {
          ...result.toObject(),
          AvgRating: avgRating,
          totalReview: totalReview,
          ratingPer: ratingPer,
        };
        return {
          message: "product found",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //searchProductByKeyWord
  async searchProductByKeyWord(keyWord, page, limit) {
    try {
      const skip = (page - 1) * limit;

      const searchWord = keyWord.trim();

      const isNum = !isNaN(parseFloat(searchWord));

      const query = {
        $or: [
          { name: { $regex: `.*${searchWord}.*`, $options: "i" } },
          { description: { $regex: `.*${searchWord}.*`, $options: "i" } },
          { feature: { $regex: `.*${searchWord}.*`, $options: "i" } },
          ...(isNum
            ? [
                {
                  $or: [{ price: searchWord }, { discountPrice: searchWord }],
                },
              ]
            : []),
        ],
      };
      const result = await productModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ id_: 1 });
      if (result) {
        return {
          message: "product get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "product not found",
          success: "success",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getSubCategoryByCategoryId
  async getSubCategoryByCategoryId(categoryId) {
    try {
      const result = await subCategoryModel
        .find({ categoryId: categoryId, isActive: true })
        .populate([
          {
            path: "categoryId",
            localField: "categoryId",
            foreignField: "categoryId",
            select: "categoryId name image",
          },
        ])
        .sort({ _id: -1 });
      let newResult;
      if (result) {
        if (result.length > 0) {
          newResult = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
          }));
        }
        return {
          message: "sub category get successfully",
          success: "success",
          code: 200,
          data: newResult,
        };
      } else {
        return {
          message: "sub category not found",
          success: "success",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getProductBySubCategoryId
  async getProductBySubCategoryId(subCategoryId) {
    try {
      const result = await productModel
        .find({ subCategoryId, isActive: true })
        .sort({ _id: -1 });
      let response = [];
      console.log(result);
      if (result) {
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const productId = data.productId;
              const product = await reviewModel.findOne({ productId });

              let avgRating = 0;
              let totalReview = 0;

              if (product) {
                avgRating =
                  product.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product.review.length;
                totalReview = product.review.length;
              }

              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                avgRating: avgRating,
                totalReview: totalReview,
              };
            })
          );
        }
        console.log(response);
        return {
          message: "product get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getProductByCategoryId
  async getProductByCategoryId(categoryId) {
    try {
      const result = await productModel
        .find({ categoryId: categoryId, isActive: true })
        .populate([
          {
            path: "categoryId",
            localField: "categoryId",
            foreignField: "categoryId",
            select: "categoryId name image",
          },
          {
            path: "subCategoryId",
            localField: "subCategoryId",
            foreignField: "subCategoryId",
            select: "subCategoryId name image",
          },
        ])
        .sort({ _id: -1 });
      let response = [];
      console.log(result);
      if (result) {
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const productId = data.productId;
              const product = await reviewModel.findOne({ productId });

              let avgRating = 0;
              let totalReview = 0;

              if (product) {
                avgRating =
                  product.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product.review.length;
                totalReview = product.review.length;
              }

              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                avgRating: avgRating,
                totalReview: totalReview,
              };
            })
          );
        }
        console.log(response);
        return {
          message: "product get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //getCategoryAndSubCategory
  async getCategoryAndSubCategory() {
    try {
      const result = await categoryModel
        .find({ isActive: true })
        .select("categoryId name image")
        .sort({ name: 1 });
      let response = [];
      console.log(result);
      if (result) {
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const categoryId = data.categoryId;
              const result = await subCategoryModel
                .find({ categoryId: categoryId, isActive: true })
                .select("subCategoryId name image")
                .sort({ name: 1 });
              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                subCategory: result,
              };
            })
          );
        }
        console.log(response);
        return {
          message: "category and subCategory get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "category and subCategory not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //getProductOfCatAndSubCatBetweenPrice

  async getProductOfCatAndSubCatBetweenPrice(
    categoryId,
    subCategoryId,
    minPrice,
    maxPrice,
    page,
    limit,
    sort
  ) {
    try {
      const skip = (page - 1) * limit;
      var dataSort = {
        _id: -1,
      };
      if (sort) {
        dataSort = {
          price: sort,
        };
      }
      console.log("Category ID:", categoryId);
      console.log("Subcategory ID:", subCategoryId);
      console.log("Min Price:", minPrice);
      console.log("Max Price:", maxPrice);

      const result = await productModel
        .find({
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          price: { $gte: minPrice, $lte: maxPrice },
          isActive: true,
        })
        .skip(skip)
        .limit(limit)
        .sort(dataSort);
      let response = [];
      console.log(result);

      if (result) {
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const productId = data.productId;
              const product = await reviewModel.findOne({ productId });

              let avgRating = 0;
              let totalReview = 0;

              if (product) {
                avgRating =
                  product.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product.review.length;
                totalReview = product.review.length;
              }

              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                avgRating: avgRating,
                totalReview: totalReview,
              };
            })
          );
        }
        console.log(response);
        return {
          message: "product get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //getProductOfCatAndSubCat
  async getProductOfCatAndSubCat(categoryId, subCategoryId, page, limit) {
    try {
      const skip = (page - 1) * limit;

      const result = await productModel
        .find({
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          isActive: true,
        })
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 });
      let response = [];
      console.log(result);

      if (result) {
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const productId = data.productId;
              const product = await reviewModel.findOne({ productId });

              let avgRating = 0;
              let totalReview = 0;

              if (product) {
                avgRating =
                  product.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product.review.length;
                totalReview = product.review.length;
              }

              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                avgRating: avgRating,
                totalReview: totalReview,
              };
            })
          );
        }
        console.log(response);
        return {
          message: "product get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //searchProByCatSubCatByKeyWord
  async searchProByCatSubCatByKeyWord(
    categoryId,
    subCategoryId,
    keyWord,
    page,
    limit
  ) {
    try {
      const skip = (page - 1) * limit;

      const searchWord = keyWord.trim();

      const isNum = !isNaN(parseFloat(searchWord));

      const query = {
        categoryId: categoryId,
        subCategoryId: subCategoryId,
        isActive: true,
        $or: [
          { name: { $regex: `.*${searchWord}.*`, $options: "i" } },
          { description: { $regex: `.*${searchWord}.*`, $options: "i" } },
          { feature: { $regex: `.*${searchWord}.*`, $options: "i" } },
          ...(isNum
            ? [{ price: searchWord }, { discountPrice: searchWord }]
            : []),
        ],
      };

      const result = await productModel
        .find({
          query,
          isActive: true,
        })
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 });
      let response = [];
      console.log(result);

      if (result) {
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const productId = data.productId;
              const product = await reviewModel.findOne({ productId });

              let avgRating = 0;
              let totalReview = 0;

              if (product) {
                avgRating =
                  product.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / product.review.length;
                totalReview = product.review.length;
              }

              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                avgRating: avgRating,
                totalReview: totalReview,
              };
            })
          );
        }
        console.log(response);
        return {
          message: "product get successfully",
          success: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
  //updateProductQuantity
  async updateProductQuantity(productId, quantity, sales) {
    try {
      const result = await productModel.findOneAndUpdate(
        { productId },
        { $inc: { quantity: -quantity, sales: quantity } },
        { new: true }
      );
      console.log(result);
      if (result) {
        return {
          message: "product update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "product update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //getAllProductByAdmin
  async getAllProductByAdmin(adminId) {
    try {
      console.log("dsffffffffffffffff",adminId);
      const result = await productModel
        .find({ownedBy: adminId,isActive:true })
        .sort({ _id: -1 })
        .populate([
          {
            path: "categoryId",
            localField: "categoryId",
            foreignField: "categoryId",
            select: "name categoryId",
          },
          {
            path: "subCategoryId",
            localField: "subCategoryId",
            foreignField: "subCategoryId",
            select: "name subCategoryId",
          },
        ]);
      console.log(result);
      let dataWithSeqNumbers;

      if (result) {
        dataWithSeqNumbers = result.map((entry, index) => ({
          seqNumber: index + 1,
          ...entry.toObject(),
        }));
        return {
          message: "products found",
          success: "success",
          code: 200,
          data: dataWithSeqNumbers === undefined ? [] : dataWithSeqNumbers,
        };
      } else {
        return {
          message: "products not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new Product();
