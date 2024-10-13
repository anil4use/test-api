const barnServiceProvider = require("../models/barnServiceProvider");
const log = require("../configs/logger.config");
const mongoose = require("mongoose");

class BarnServiceProviderDao {
  async createBarnServiceProvider(data) {
    try {
      const newAssociation = new barnServiceProvider(data);
      const result = await newAssociation.save();

      if (result) {
        return {
          message: "barn retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  //getAllBarn
  async getAllBarn(adminId) {
    try {
      const barnServiceProviders = await barnServiceProvider.aggregate([
        {
          $match: { serviceProvider: adminId },
        },
        {
          $lookup: {
            from: "barns", // Collection name in Mongodb
            localField: "barnId", // Field in BarnServiceProvider
            foreignField: "barnId", // Field in Barn model
            as: "barnDetails", // Output array field
          },
        },
        {
          $unwind: "$barnDetails", // Convert array to object (since it's a one-to-one relationship)
        },
        {
          $project: {
            barnName: "$barnDetails.name",
            barnContact: "$barnDetails.contact",
            barnLocation: "$barnDetails.location",
            startDate: 1, // Include startDate from BarnServiceProvider
          },
        },
      ]);

      if (barnServiceProviders) {
        return {
          message: "barn retrieved successfully",
          success: "success",
          code: 200,
          data: barnServiceProviders,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  //removeBarnServiceProvider
  async removeBarnServiceProvider(adminId, barnId) {
    try {
      const result = await barnServiceProvider.findOneAndDelete({
        barnId,
        serviceProvider: adminId,
      });


      if (result) {
        return {
          message: "service removed  from barn successfully",
          success: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new BarnServiceProviderDao();
