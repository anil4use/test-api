const log = require("../configs/logger.config");
const barnModel = require("../models/barn/barn.model");
const barnReviewModel = require("../models/barn/barnReview.model");
const RentBarnModel = require("../models/barn/barnrental.model");
const productModel = require("../models/product/product.model");
const serviceModel = require("../models/service/service.model");
const staffModel = require("../models/staff/staff.model");
const axios = require("axios");

const { hashItem } = require("../utils/helpers/bcrypt.utils");
const {
  dateFormatter,
  currencyFormatter,
} = require("../utils/helpers/common.utils");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
const adminDao = require("./admin.dao");

class BarnDao {
  async addBarn(data) {
    try {
      const barnId = "Barn_" + (await getNextSequenceValue("barn"));
      data.barnId = barnId;

      const barnInfo = new barnModel(data);
      const result = await barnInfo.save();
      log.info("barn saved");
      if (result) {
        return {
          message: "barn added successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [BARN DAO] : barn creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }
  //getAllBarn

  async getAllBarn() {
    try {
      const result = await barnModel
        .find({})
        .sort({ _id: -1 })
        .populate([
          {
            path: "barnOwner",
            localField: "Staff",
            foreignField: "staffId",
            select: "name",
          },
        ]);
      let dataWithSeqNumbers;
      if (result) {
        if (result.length > 0) {
          dataWithSeqNumbers = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
          }));
        }

        if (dataWithSeqNumbers === undefined) {
          dataWithSeqNumbers = [];
          return {
            message: "barns retrieved successfully",
            success: "success",
            code: 200,
            data: dataWithSeqNumbers,
          };
        } else {
          return {
            message: "barns retrieved successfully",
            success: "success",
            code: 200,
            data: dataWithSeqNumbers,
          };
        }
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  //getAllBarnForUser
  async getAllBarnForUser(minPrice, maxPrice, keyWord, page, limit, sort) {
    try {
      let filters = {};
      if (minPrice && maxPrice) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }

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
          price: sort,
        };
      }

      const skip = (page - 1) * limit;

      const result = await barnModel
        .find(filters)
        .skip(skip)
        .limit(limit)
        .sort(dataToSort)
        .populate([
          {
            path: "barnOwner",
            localField: "Staff",
            foreignField: "staffId",
            select: "name",
          },
        ]);
      if (result) {
        let response = [];
        if (result.length > 0) {
          response = await Promise.all(
            result.map(async (data, index) => {
              const seqNumber = index + 1;
              const barnId = data.barnId;
              const barn = await barnReviewModel.findOne({ barnId });
              let avgRating = 0;
              let totalReview = 0;
              if (barn) {
                avgRating =
                  barn.review.reduce((acc, review) => acc + review.rating, 0) /
                  barn.review.length;
                totalReview = barn.review.length;
              }
              return {
                seqNumber: seqNumber,
                ...data.toObject(),
                avgRating: avgRating,
                reviewTotal: totalReview,
              };
            })
          );
        }
        console.log(response);
        return {
          message: "barns get successfully",
          status: "success",
          code: 200,
          data: response,
        };
      } else {
        return {
          message: "barns not found",
          status: "success",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  async getBarnByIdForUser(barnId) {
    try {
      const result = await barnModel.findOne({ barnId });
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

  async getBarnById(barnId) {
    try {
      const result = await barnModel.findOne({ barnId });
      if (result) {
        return {
          message: "barn retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "barn not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }
  //updateBarn
  async updateBarn(barnId, data) {
    try {
      const result = await barnModel.findOneAndUpdate(
        { barnId: barnId },
        data,
        {
          new: true,
        }
      );
      result.price = currencyFormatter(result.price);
      console.log(result);

      if (result) {
        return {
          message: "barn update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }
  //deleteBarn
  async deleteBarn(barnId) {
    try {
      const result = await barnModel.findOneAndDelete({ barnId });
      result.price = currencyFormatter(result.price);
      if (result) {
        return {
          message: "barn deleted successfully",
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
  //getBarnByEmail
  async getBarnByEmail(email) {
    try {
      console.log(email);
      const result = await barnModel.findOne({ "contact.email": email });
      console.log(result);
      if (result) {
        return {
          message: "barn retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "barn not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  async getBarnByContact(phoneNumber) {
    try {
      const result = await barnModel.findOne({
        "contact.phoneNumber": phoneNumber,
      });
      if (result) {
        return {
          message: "barn retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "barn not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  async getBarnByBarnOwner(barnOwner) {
    try {
      const result = await barnModel.findOne({
        barnOwner: barnOwner,
      });
      if (result) {
        return {
          message: "barn retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "barn not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  //getReview
  async getBarnReview(barnId, userId) {
    try {
      const result = await barnReviewModel.findOne({
        barnId,
        review: {
          $elemMatch: {
            userId: userId,
          },
        },
      });
      if (result) {
        return {
          message: "barn review retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "barn review not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }
  //updateTheReviewOfTheUser
  async updateTheReviewOfTheUser(barnId, data) {
    try {
      const result = await barnReviewModel.findOneAndUpdate(
        {
          barnId: barnId,
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
        const updatedResult = await barnReviewModel.findOneAndUpdate(
          { barnId: barnId },
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
      log.error("Error from [BARN REVIEW DAO] : ", error);
      throw error;
    }
  }
  //
  async getBarnByBarnId(barnId) {
    try {
      const result = await barnReviewModel
        .findOne({ barnId })
        .sort({ _id: -1 });
      if (result) {
        return {
          message: "barn review get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "barn review not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN REVIEW DAO] : ", error);
      throw error;
    }
  }

  //createRentalSpace
  async createRentalSpace(rentalData) {
    try {
      const barnRentalId =
        "BarnRental_" + (await getNextSequenceValue("BarnRental"));
      rentalData.barnRentalId = barnRentalId;
      console.log("fdssssssssssssss", rentalData);
      const barnRentalInfo = new RentBarnModel(rentalData);
      const result = await barnRentalInfo.save();
      log.info("barn  rental detail saved");
      if (result) {
        return {
          message: "rental barn detail added successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [BARN DAO] : barn rental creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  //getAllRentalSpaceHorse
  async getAllRentalSpaceHorse() {
    try {
      const result = await RentBarnModel.find({ isActive: true }).sort({
        _id: -1,
      });
      if (result) {
        return {
          message: "horse details get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "horse details not successfully",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }
  //getRentalSpaceById
  async getRentalSpaceById(barnRentalId) {
    try {
      const result = await RentBarnModel.findOne({ barnRentalId });
      if (result) {
        return {
          message: "RentBarn details get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "RentBarn not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }
  //updateRentalSpace
  async updateRentalSpace(barnRentalId) {
    try {
      const result = await RentBarnModel.findOneAndUpdate(
        { barnRentalId },
        { isActive: true },
        { new: true }
      );
      if (result) {
        return {
          message: "RentBarn details update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "RentBarn update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  //pushNewServiceInBarn
  async pushNewServiceInBarn(barnId, service) {
    try {
      const result = await barnModel.findOneAndUpdate(
        { barnId: barnId },
        { $push: { barnServices: service } },
        { new: true }
      );
      if (result) {
        return {
          message: "barn review get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "barn review not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN REVIEW DAO] : ", error);
      throw error;
    }
  }
  // /updateProviderDetail
  async updateProviderDetail(barnId, serviceId, adminId, role, contact) {
    try {
      const result = await barnModel.findOneAndUpdate(
        { barnId: barnId },
        {
          $push: {
            providerServices: {
              service: serviceId,
              providedBy: adminId,
              role,
              contact,
            },
          },
        },
        { new: true }
      );
      if (result) {
        return {
          message: "provider detail get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "provider details, not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN REVIEW DAO] : ", error);
      throw error;
    }
  }

  //removeProviderDetail
  async removeProviderDetail(barnId, serviceId, adminId) {
    try {
      const result = await barnModel.findOneAndUpdate(
        { barnId: barnId },
        {
          $pull: {
            providerServices: {
              service: serviceId,
              providedBy: adminId,
            },
          },
        },
        { new: true }
      );
      if (result) {
        return {
          message: "provider detail get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "provider details, not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [BARN REVIEW DAO] : ", error);
      throw error;
    }
  }

  async allServiceProviderAssociateByBarn(adminId) {
    try {
      const barns = await barnModel
        .find({ barnOwner: adminId })
        .select("providerServices");
      let response = [];

      if (barns && barns.length > 0) {
        response = await Promise.all(
          barns.flatMap((barn) => {
            if (barn.providerServices && barn.providerServices.length > 0) {
              return barn.providerServices.map(async (service) => {
                const staffId = service.providedBy;
                const serviceId = service.service;

                const adminDetail = await staffModel
                  .findOne({ staffId })
                  .select("name");
                const serviceDetail = await serviceModel.findOne({ serviceId });
                return {
                  providerDetail: {
                    name: adminDetail ? adminDetail.name : null,
                    role: service.role,
                    contact: {
                      phoneNumber: service.contact.phoneNumber,
                      email: service.contact.email,
                    },
                    service: {
                      id: serviceDetail ? serviceDetail._id : null,
                      name: serviceDetail ? serviceDetail.name : null,
                      feature: serviceDetail ? serviceDetail.feature : null,
                      description: serviceDetail
                        ? serviceDetail.description
                        : null,
                      coverImage: serviceDetail
                        ? serviceDetail.coverImage
                        : null,
                      images: serviceDetail ? serviceDetail.images : [],
                      price: serviceDetail ? serviceDetail.price : null,
                      discount: serviceDetail ? serviceDetail.discount : null,
                      discountPrice: serviceDetail
                        ? serviceDetail.discountPrice
                        : null,
                      isActive: serviceDetail ? serviceDetail.isActive : null,
                      status: serviceDetail ? serviceDetail.status : null,
                    },
                  },
                };
              });
            } else {
              return [];
            }
          })
        );

        return {
          message: "Service providers retrieved successfully",
          status: "success",
          code: 200,
          data: response,
        };
      } else {
        log.error("Error from [Barn Dao] : service retrieved error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [BARN DAO] : ", error);
      throw error;
    }
  }

  //getAllBarnProducts
  async getAllBarnProducts(parent) {
    try {
      const barnDetail = await barnModel.findOne({ barnOwner: parent });
      console.log("FSD");
      const result = await productModel
        .find({ ownedBy: barnDetail.barnId })
        .sort({ _id: -1 });
      if (result) {
        return {
          message: "products get successfully",
          success: "success",
          code: 200,
          data: result,
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
      log.error("Error from [BARN REVIEW DAO] : ", error);
      throw error;
    }
  }

  //get barn address using longitute and latitute
  async getBarnAddress(latitude, longitude) {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      if (response.data) {
        return {
          message: "address get successfully",
          success: "success",
          code: 200,
          data: response.data.display_name,
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
      log.error("Error from [BARN REVIEW DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new BarnDao();
