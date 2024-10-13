const log = require("../configs/logger.config");
const serviceModel = require("../models/service/service.model");
const serviceReviewModel = require("../models/service/serviceReview.model");
const serviceCategoryModel = require("../models/service/serviceCategory.model");
const serviceEnquiryModel = require("../models/service/serviceEnquiry.model");
const rentalServiceModel = require("../models/service/servicePurchase.model");
const {
  dateFormatter,
  currencyFormatter,
} = require("../utils/helpers/common.utils");
const { titleCase } = require("../utils/helpers/common.utils");
const getNextSequenceValue = require("../utils/helpers/counter.utils");

class ServiceDao {
  async addService(data) {
    try {
      const serviceId = "BCS_" + (await getNextSequenceValue("service"));
      data.serviceId = serviceId;
      data.name = titleCase(data.name);
      const serviceInfo = new serviceModel(data);
      const result = await serviceInfo.save();
      result.price = currencyFormatter(result.price);
      log.info("service saved");
      if (result) {
        return {
          message: "service added successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [SERVICE DAO] : service creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //getAllservice

  async getAllService() {
    try {
      const result = await serviceModel
        .find({})
        .populate([
          {
            path: "serviceCategoryId",
            localField: "serviceCategoryId",
            foreignField: "serviceCategoryId",
            select: "name serviceCategoryId",
          },
        ])
        .sort({ _id: -1 });
      let dataWithSeqNumbers;
      if (result) {
        if (result.length > 0) {
          dataWithSeqNumbers = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
            date: dateFormatter(entry.createdAt),
            address: `${entry.streetName},${entry.city},${entry.country}`,
          }));
        }

        return {
          message: "services retrieved successfully",
          success: "success",
          code: 200,
          data: dataWithSeqNumbers === undefined ? [] : dataWithSeqNumbers,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //getServiceById
  async getServiceById(serviceId) {
    try {
      const result = await serviceModel.findOne({ serviceId });
      if (result) {
        return {
          message: "service retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //updateService
  async updateService(serviceId, data) {
    try {
      if (data.name) {
        data.name = titleCase(data.name);
      }
      console.log(serviceId, data);
      const result = await serviceModel.findOneAndUpdate(
        { serviceId: serviceId },
        data,
        {
          new: true,
        }
      );
      console.log(result);

      if (result) {
        return {
          message: "service update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //deleteService
  async deleteService(serviceId) {
    try {
      const result = await serviceModel.findOneAndDelete({ serviceId });
      if (result) {
        return {
          message: "service deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service not deleted",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }

  //getAllServiceForUser
  async getAllServiceForUser(
    minPrice,
    maxPrice,
    serviceCategoryId,
    keyWord,
    page,
    limit,
    sort
  ) {
    try {
      let filters = {};
      //filter by category
      if (serviceCategoryId) {
        filters.serviceCategoryId = serviceCategoryId;
      }
      console.log(serviceCategoryId);
      //filter by price range

      if (minPrice && maxPrice) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }

      //filter by keyword

      if (keyWord) {
        filters.$or = [
          { name: { $regex: `.*${keyWord}.*`, $options: "i" } },
          { description: { $regex: `.*${keyWord}.*`, $options: "i" } },
          { feature: { $regex: `.*${keyWord}.*`, $options: "i" } },
        ];
      }

      let dataToSort = {
        _id: -1,
      };

      if (sort) {
        dataToSort = {
          discountPrice: sort,
        };
      }
      const skip = (page - 1) * limit;

      const result = await serviceModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .sort(dataToSort)
        .populate([
          {
            path: "serviceCategoryId",
            localField: "serviceCategoryId",
            foreignField: "serviceCategoryId",
            select: "name serviceCategoryId",
          },
        ]);
      console.log(result);
      if (result) {
        let response = [];
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data) => {
              const serviceId = data.serviceId;
              const service = await serviceReviewModel.findOne({ serviceId });
              let avgRating = 0;
              let totalReview = 0;
              if (service) {
                avgRating =
                  service.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / service.review.length;
                totalReview = service.review.length;
              }
              return {
                ...data.toObject(),
                avgRating,
                totalReview,
              };
            })
          );
        }
        const responseData = response.length === 1 ? response[0] : response;

        return {
          message: "service get successfully",
          status: "success",
          code: 200,
          data: responseData,
        };
      } else {
        return {
          message: "service not found",
          status: "fail",
          code: 200,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //
  async getServiceById(serviceId) {
    try {
      const result = await serviceModel.findOne({ serviceId });
      if (result) {
        return {
          message: "service retrieved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "service not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //getAllServiceByServiceIdForUser
  async getAllServiceByServiceIdForUser(serviceId) {
    try {
      const result = await serviceModel.find({ serviceId }).populate([
        {
          path: "serviceCategoryId",
          localField: "serviceCategoryId",
          foreignField: "serviceCategoryId",
          select: "name serviceCategoryId",
        },
      ]);

      if (result) {
        let response = [];
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data) => {
              const serviceId = data.serviceId;
              const service = await serviceReviewModel.findOne({ serviceId });
              let avgRating = 0;
              let totalReview = 0;
              if (service) {
                avgRating =
                  service.review.reduce(
                    (acc, review) => acc + review.rating,
                    0
                  ) / service.review.length;
                totalReview = service.review.length;
              }
              return {
                ...data.toObject(),
                avgRating,
                totalReview,
              };
            })
          );
        }
        const responseData = response.length === 1 ? response[0] : response;
        return {
          message: "service get successfully",
          status: "success",
          code: 200,
          data: responseData,
        };
      } else {
        return {
          message: "service not found",
          status: "fail",
          code: 200,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //addEnquiryDetail
  async addEnquiryDetail(data) {
    try {
      data.name = titleCase(data.name);
      const serviceEnquiryId =
        "BCSE_" + (await getNextSequenceValue("serviceEnquiry"));
      data.serviceEnquiryId = serviceEnquiryId;

      const serviceEnquiryInfo = new serviceEnquiryModel(data);
      const result = await serviceEnquiryInfo.save();
      log.info("service Enquiry saved");
      if (result) {
        return {
          message: "enquiry save successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [SERVICE DAO] : service Enquiry creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }

  //getAllServiceEnquiryServices
  async getAllServiceEnquiry() {
    try {
      const result = await serviceEnquiryModel
        .find({})
        .sort({ _id: -1 })
        .populate([
          {
            path: "serviceId",
            foreignField: "serviceId",
          },
          {
            path: "userId",
            foreignField: "userId",
          },
        ]);

      log.info("service Enquiry retrieved");
      if (result) {
        return {
          message: "enquiry retrieved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "no enquiry found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }

  //getServiceEnquiryById
  async getServiceEnquiryById(serviceEnquiryId) {
    try {
      const result = await serviceEnquiryModel.findOne({ serviceEnquiryId });
      log.info("service Enquiry retrieved");
      if (result) {
        return {
          message: "enquiry retrieved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "no enquiry found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }

  //deleteServiceEnquiryById
  async deleteServiceEnquiryById(serviceEnquiryId) {
    try {
      const result = await serviceEnquiryModel.findOneAndDelete({
        serviceEnquiryId,
      });

      log.info("service Enquiry deleted");
      if (result) {
        return {
          message: "enquiry deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "no enquiry deletion fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [SERVICE DAO] : ", error);
      throw error;
    }
  }
  //createServicePurchase
  async createServicePurchase(rentalData) {
    try {
      const serviceRentId =
        "ServiceRent_" + (await getNextSequenceValue("serviceRent"));
      rentalData.serviceRentId = serviceRentId;
      const rental = new rentalServiceModel(rentalData);
      const result = await rental.save();

      if (result) {
        return {
          message: "rent created successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "rent creation fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [RENTAL PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //getRentalServiceSummaryById
  async getRentalServiceSummaryById(serviceRentId) {
    try {
      const result = await rentalServiceModel.findOne({ serviceRentId });

      if (result) {
        return {
          message: "rental service get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "rent service not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [RENTAL PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //deleteRentalSummary
  async deleteRentalSummary(serviceRentId) {
    try {
      const result = await rentalServiceModel.findOneAndDelete({
        serviceRentId,
      });

      if (result) {
        return {
          message: "rental service delete successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "rental service delete fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [RENTAL PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //updateServicePurchase
  async updateServicePurchase(serviceRentId, updateData) {
    try {

      console.log("fddddddddddddddddddddddddddddddddddddddd",updateData)
      const result = await rentalServiceModel.findOneAndUpdate(
        { serviceRentId },
        updateData,
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
module.exports = new ServiceDao();
