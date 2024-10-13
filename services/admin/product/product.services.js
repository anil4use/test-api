const log = require("../../../configs/logger.config");
const adminDao = require("../../../daos/admin.dao");
const barnDao = require("../../../daos/barn.dao");
const categoryDao = require("../../../daos/category.dao");
const productDao = require("../../../daos/product.dao");
const subCategoryDao = require("../../../daos/subCategory.dao");
const rentalProductDao = require("../../../daos/rentalProduct.dao");

const { deleteS3Object } = require("../../../utils/helpers/files.helper");

class ProductService {
  async addProductService(req, res) {
    try {
      const adminId = req.userId;
      const {
        name,
        quantity,
        price,
        feature,
        discount,
        discountPrice,
        description,
        categoryId,
        subCategoryId,
        isRental,
        isActive,
      } = req.body;
      console.log(req.body);
      if (
        !adminId ||
        !name ||
        !quantity ||
        !price ||
        !feature ||
        !discount ||
        !discountPrice ||
        !description ||
        !categoryId ||
        !subCategoryId ||
        !isRental ||
        !isActive ||
        !req.files.image ||
        !req.files.image[0].location ||
        !req.files.images
      ) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      const isExist = await productDao.getProductByName(name);
      console.log(isExist.data);
      if (isExist.data) {
        return res.status(201).json({
          message: "product name already exist",
          success: "fail",
          code: 201,
        });
      }
      const isCatExist = await categoryDao.getCategoryById(categoryId);
      console.log(isCatExist.data);
      if (!isCatExist.data) {
        return res.status(201).json({
          message: "category not exist",
          success: "fail",
          code: 201,
        });
      }
      const isSubCatExist = await subCategoryDao.getSubCategoryById(
        subCategoryId
      );
      if (!isSubCatExist.data) {
        return res.status(201).json({
          message: "subcategory not exist",
          success: "fail",
          code: 201,
        });
      }

      let imgArray = [];
      if (req.files.images.length > 0) {
        await Promise.all(
          req.files.images.map((img) => {
            imgArray.push(img.location);
          })
        );
      }

      let parentId = null;
      const isAdmin = await adminDao.getById(adminId);
      if (isAdmin.data?.adminType !== "BarnOwner") {
        if (isAdmin.data) {
          parentId = adminId;
        } else {
          return res.status(404).json({
            message: "admin not found",
            status: "fail",
            code: 201,
          });
        }
      } else {
        const parentInfo = await barnDao.getBarnByBarnOwner(adminId);
        if (parentInfo.data) {
          parentId = parentInfo.data.barnId;
        } else {
          return res.status(404).json({
            message: "admin not found",
            status: "fail",
            code: 201,
          });
        }
      }

      const data = {
        name,
        coverImage: req.files.image[0].location,
        images: imgArray,
        quantity,
        price,
        feature,
        discount,
        discountPrice,
        description,
        categoryId,
        subCategoryId,
        ownedBy: parentId,
        isRental,
        isActive,
      };

      const result = await productDao.createProduct(data);
      if (result) {
        return res.status(200).json({
          message: "product created successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "product creation fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //updateProductByIdService

  async updateProductByIdService(req, res) {
    try {
      const adminId = req.userId;
      const {
        productId,
        name,
        isActive,
        quantity,
        price,
        feature,
        discount,
        discountPrice,
        description,
        categoryId,
        subCategoryId,
        isRental,
      } = req.body;
      if (!adminId || !productId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const isExistProduct = await productDao.getProductById(productId);
      console.log(isExistProduct.data.name);
      if (!isExistProduct.data) {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
        });
      }

      const owner = await adminDao.getById(adminId);

      // if (owner?.data?.adminId !== isExistProduct?.data?.ownedBy) {
      //   return res.status(201).json({
      //     message: "you can update product owned by you only",
      //     success: "fail",
      //     code: 201,
      //   });
      // }

      const isOtherThisName = await productDao.getProductNotFromThisIdByName(
        productId,
        name
      );
      if (isOtherThisName.data) {
        return res.status(201).json({
          message: "product name already exist",
          success: "fail",
          code: 201,
        });
      }

      if (categoryId) {
        const result = await categoryDao.getCategoryById(categoryId);
        if (!result.data) {
          return res.status(200).json({
            message: "category not found",
            success: "fail",
            code: 201,
            data: null,
          });
        }
      }
      if (subCategoryId) {
        const result = await subCategoryDao.getSubCategoryById(subCategoryId);
        if (!result.data) {
          return res.status(200).json({
            message: "subcategory not found",
            success: "fail",
            code: 201,
            data: null,
          });
        }
      }
      let newCoverImage;
      if (req.files.image && req.files.image[0].location) {
        let del = await deleteS3Object(isExistProduct.data.coverImage);
        newCoverImage = req.files.image[0].location;
      } else {
        newCoverImage = isExistProduct.data.coverImage;
      }
      
      let newImageArray = [];
      if (req.files.images && req.files.images.length > 0) {
        isExistProduct.data.images.map(
          async (img) => await deleteS3Object(img)
        );
        await Promise.all(
          req.files.images.map((img) => {
            newImageArray.push(img.location);
          })
        );
      } else {
        newImageArray = isExistProduct.data.images;
      }
      const data = {
        name,
        coverImage: newCoverImage,
        images: newImageArray,
        quantity,
        price,
        feature,
        discount,
        discountPrice,
        description,
        categoryId,
        subCategoryId,
        isActive,
        isRental,
      };
      console.log(data);
      const result = await productDao.updateProduct(productId, data);
      if (result) {
        return res.status(200).json({
          message: "product update successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "product update fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }

  //deleteProductByIdService
  async deleteProductByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { productId } = req.body;
      if (!adminId || !productId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      console.log(productId);
      const isExistProduct = await productDao.getProductById(productId);
      console.log(isExistProduct.data.name);
      if (!isExistProduct.data) {
        return res.status(201).json({
          message: "product not found",
          success: "fail",
          code: 201,
        });
      }
      isExistProduct.data.images.map(async (img) => await deleteS3Object(img));
      await deleteS3Object(isExistProduct.data.coverImage);
      const result = await productDao.deleteProduct(productId);
      if (result.data) {
        deleteS3Object(result.data);
        return res.status(200).json({
          message: "product deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "product deletion fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
  //getProductByIdService
  async getProductByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { productId } = req.body;
      if (!adminId || !productId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      console.log(productId);
      const result = await productDao.getProductCatSubCatDetailsById(productId);
      console.log(result.data.name);
      if (result.data) {
        return res.status(200).json({
          message: "product retrieved successfully",
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
  //getAllProductService
  async getAllProductService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }
      
      const getAdmin=await adminDao.getById(adminId);
      let parent=null;
      let barn=null;
      if(getAdmin.data){
        if(getAdmin?.data?.parentId){
          parent=getAdmin.data.parentId;
          const barnDetail=await barnDao.getBarnByBarnOwner(parent);
          parent=barnDetail.data.barnId;
        }else{
          parent=adminId;
        }
      }
         let result=null;
       if(getAdmin.data.adminType==="superAdmin"){
         result = await productDao.getAllProduct();
       }else{
        result = await productDao.getAllProductByAdmin(parent);

       }
      if (result.data) {
        return res.status(200).json({
          message: "product retrieved successfully",
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

  //returnProductService
  async returnProductService(req, res) {
    try {
      const adminId = req.userId;
      const { rentId } = req.body;

      if (!adminId || !rentId) {
        return res.status(400).json({
          message: "Invalid request",
          success: "fail",
          data: null,
          code: 201,
        });
      }

      const isExist = await rentalProductDao.getRentalProduct(rentId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "product not found in rental",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      console.log("isExistttttttttt", isExist.data);

      console.log("is", isExist?.data?.quantity);
      let productId = isExist?.data?.productId;
      const isExistProduct = await productDao.getProductById(productId);
      if (!isExistProduct.data) {
        return res.status(400).json({
          message: "product no longer exist",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      let productCount = isExist.data.quantity;
      let data = {
        isReturn: true,
      };
      const updatedReturn = await rentalProductDao.updateIsReturn(
        isExist.data.rentId,
        data
      );

      let quantity = isExistProduct.data.quantity;
      data = {
        quantity: quantity + productCount,
      };
      const updateProduct = await productDao.updateProduct(productId, data);
      if (updateProduct.data) {
        return res.status(400).json({
          message: "product updated successfully",
          status: "success",
          code: 200,
        });
      }
    } catch (error) {
      log.error("error from [PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new ProductService();
