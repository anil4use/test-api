const log = require("../configs/logger.config");
const serviceReviewModel = require("../models/service/serviceReview.model");
class serviceReviewDao {
  async getServiceReview(serviceId, userId) {
    try {
      const result = await serviceReviewModel.findOne({
        serviceId,
        review: {
          $elemMatch: {
            userId: userId,
          },
        },
      });

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
      log.error("error from [SERVICE REVIEW DAO]", error);
      throw error;
    }
  }
  //updateServiceReview

  async updateServiceReview(serviceId, data) {
    try {
      console.log(serviceId, data);
        const result = await serviceReviewModel.findOneAndUpdate(
        {
          serviceId: serviceId,
          "review.userId": data.userId
        },
        {
          $set: {
            "review.$": data
          }
        },
        {
          new: true
        }
      );
  
      if (!result)
      {
        const updatedResult = await serviceReviewModel.findOneAndUpdate(
          { serviceId: serviceId },
          {
            $push: {
              review: data
            }
          },
          {
            new: true,
            upsert: true
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
      log.error("Error from [SERVICE REVIEW DAO] : ", error);
      throw error;
    }
  }


  //

  
  async getServiceByServiceId(serviceId) {
    try {
      const result = await serviceReviewModel.findOne({ serviceId }).sort({_id:-1});
      if (result) {
        return {
          message: "service review get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service review not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE REVIEW DAO] : ", error);
      throw error;
    }
  }
}

module.exports = new serviceReviewDao();
