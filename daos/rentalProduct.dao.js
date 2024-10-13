const orderModel = require("../models/order/order.model");
const userModel = require("../models/user.model");
const rentalProductModel = require("../models/product/rentalProduct.model");
const productModel = require("../models/product/product.model");
const log = require("../configs/logger.config");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
class RentalProductDao {
  async createRentalProduct(rentalData) {
    try {
      const rentId = "Rent_" + (await getNextSequenceValue("rent"));
      rentalData.rentId = rentId;
      const rental = new rentalProductModel(rentalData);
      const result = await rental.save();

      if (result) {
        return {
          message: "rent created successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "rent creation fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [RENTAL PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //getRentalProduct
  async getRentalProduct(rentId) {
    try {
      const result = await rentalProductModel.findOne({ rentId });

      if (result) {
        return {
          message: "rent product get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "rent product not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [RENTAL PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //updateIsReturn

  async updateIsReturn(rentId, data) {
    try {
      const result = await rentalProductModel.findOneAndUpdate(
        { rentId },
        data,
        {
          new: true,
        }
      );

      if (result) {
        return {
          message: "rent product updated successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "error while updating rental product",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [RENTAL PRODUCT DAO] : ", error);
      throw error;
    }
  }

  async deleteRentalProduct(rentId) {
    try {
      const result = await rentalProductModel.findOneAndDelete({ rentId });

      if (result) {
        return {
          message: "rent product deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "rental product delete fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [RENTAL PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //updateRentalProduct
  async updateRentalProduct(rentId, rentalData) {
    try {
      const result = await rentalProductModel.findOneAndUpdate(
        { rentId },
        rentalData,
        {
          new: true,
        }
      );

      if (result) {
        return {
          message: "rent product deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "rental product delete fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [RENTAL PRODUCT DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new RentalProductDao();
