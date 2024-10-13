const log = require("../../configs/logger.config");
const barnDao = require("../../daos/barn.dao");
const orderDao = require("../../daos/order.dao");
const userDao = require("../../daos/user.dao");
const { rentalSpacePayment } = require("../../hook/payment");
const {
  validateUSAMobileNumber,
  validateEmail,
  titleCase,
} = require("../../utils/helpers/validator.utils");
class BarnService {
  async getAllBarnService(req, res) {
    try {
      const {
        minPrice,
        maxPrice,
        keyWord,
        page = 1,
        limit = 9,
        sort,
      } = req.body;
      const result = await barnDao.getAllBarnForUser(
        minPrice,
        maxPrice,
        keyWord,
        page,
        limit,
        sort
      );
      if (result.data) {
        return res.status(200).json({
          message: "barn get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(200).json({
          message: "get barn fail",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
  //getBarnByIdService
  async getBarnByIdService(req, res) {
    try {
      const { barnId } = req.body;
      if (!barnId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const isExistBarn = await barnDao.getBarnByIdForUser(barnId);
      if (!isExistBarn.data) {
        return res.status(400).json({
          message: "barn not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await barnDao.getBarnByIdForUser(barnId);
      if (result.data) {
        return res.status(200).json({
          message: "barn get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(200).json({
          message: "get barn fail",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  //addReviewByBarnIdService
  async addReviewByBarnIdService(req, res) {
    try {
      const { barnId, description, rating } = req.body;
      const userId = req.userId;
      console.log(userId);
      if (!barnId || !rating || !description) {
        log.error("Error from [REVIEW SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "failed",
          data: null,
          code: 201,
        });
      }
      const isReviewExist = await barnDao.getBarnReview(barnId, userId);
      console.log(isReviewExist.data);
      let result;
      const data = {
        userId: userId,
        rating: rating,
        description: description,
      };
      console.log(data);
      if (isReviewExist.data) {
        result = await barnDao.updateTheReviewOfTheUser(barnId, data);
      } else {
        result = await barnDao.updateTheReviewOfTheUser(barnId, data);
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
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
  //getReviewByBarnIdService

  async getReviewByBarnIdService(req, res) {
    try {
      const { barnId } = req.body;
      if (!barnId) {
        log.error("Error from [REVIEW SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "failed",
          data: null,
          code: 201,
        });
      }
      const result = await barnDao.getBarnByBarnId(barnId);
      let data = [];
      if (result.data) {
        data = await Promise.all(
          result.data.review.map(async (res) => {
            const userId = res.userId;
            const userDetail = await userDao.getUserById(userId);
            let user;
            if (userDetail.data) {
              if (userDetail.data) {
                user = `${
                  userDetail.data.firstName + userDetail.data.lastName
                }`;
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
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  //rentingSpaceService
  async rentingSpaceService(req, res) {
    try {
      const userId = req.userId;
      const {
        boarderName,
        address,
        phoneNumber,
        horseDetails,
        price,
        barnId,
        boardFacilityName,
        boardFacilityAddress,
        days,
      } = req.body;
      if (
        !userId ||
        !barnId ||
        !boarderName ||
        !address ||
        !phoneNumber ||
        !horseDetails ||
        !price ||
        !boardFacilityName ||
        !boardFacilityAddress
      ) {
        log.error("Error from [BARN SERVICE]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "failed",
          data: null,
          code: 201,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(400).json({
          message: "user not found",
          status: "fail",
          data: null,
          code: 201,
        });
      }

      if (phoneNumber) {
        if (!validateUSAMobileNumber(phoneNumber)) {
          return res.status(400).json({
            message: "please enter valid phoneNumber",
            status: "fail",
            code: 201,
          });
        }
      }


      const isExistBarn = await barnDao.getBarnByIdForUser(barnId);
      if (!isExistBarn.data) {
        return res.status(400).json({
          message: "barn not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const barnPrice=isExistBarn?.data?.price;


      console.log("bbbbbbbbbbbbbbbbb", Array.isArray(horseDetails));

      if (!Array.isArray(horseDetails)) {
        return res.status(400).json({
          message: "horseDetails should be in array",
          status: "fail",
          code: 201,
        });
      }

      const horseDetailsFetched = await Promise.all(
        horseDetails.map(async (horseId) => {
          const horse = await userDao.getHorseDetailById(userId, horseId);
          if (!horse.data) {
            throw new Error(`horse ${horseId} not found`);
          }
          return horse.data;
        })
      );

      let quantity = horseDetails.length;
      let totalPrice = barnPrice * quantity;

      console.log("horseDetailsFetched", horseDetailsFetched);

      const rentalData = {
        boarderName,
        address,
        phoneNumber,
        horseDetail: horseDetailsFetched,
        userId,
        barnId,
        boardFacilityName,
        boardFacilityAddress,
        days,
        price,
        totalPrice,
        isActive: false,
      };

      const result = await barnDao.createRentalSpace(rentalData);
      const barnRentalId = result.data.barnRentalId;
      if (!result.data) {
        return res.status(201).json({
          message: "error while creating rental space",
          status: "fail",
          data: null,
          code: 201,
        });
      }

      let orderItem = horseDetailsFetched.map((horse) => ({
        name: horse.horseName,
        quantity: 1,
        coverImage: horse.images[0],
        reducedPrice: price,
      }));

      const orderData = {
        user: userId,
        orderItems: orderItem,
        totalPrice,
      };

      const createOrder = await orderDao.createOrder(orderData);
      const session = await rentalSpacePayment(createOrder.data, barnRentalId);

      console.log("dddddddddddddddddddddddd", createOrder.data);
      if (createOrder.data) {
        return res.status(200).json({
          message: "order created successfully",
          status: "success",
          data: session,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "order created fail",
          status: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  //rentingSpaceSummary
  async rentingSpaceSummary(req, res) {
    try {
      const userId = req.userId;
      const { barnId, horseCount } = req.body;
      if (!userId || !barnId || !horseCount) {
        log.error("Error from [BARN SERVICE]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "failed",
          data: null,
          code: 201,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(400).json({
          message: "user not found",
          status: "fail",
          data: null,
          code: 201,
        });
      }
     
      const isExistBarn = await barnDao.getBarnByIdForUser(barnId);
      if (!isExistBarn.data) {
        return res.status(400).json({
          message: "barn not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const barnPrice=isExistBarn?.data?.price;
      let totalItem=horseCount;
      let totalPrice=barnPrice*totalItem;
      let beforeTex=totalPrice;
      const tax = 0;
      const orderTotal = beforeTex + tax;


      const orderSummary = {
        items: totalItem,
        totalPrice: totalPrice,
        shipping:0,
        beforeTex: beforeTex,
        taxCollected: tax,
        orderTotal: orderTotal,
      };

      if (isExistBarn.data) {
        return res.status(200).json({
          message: "stall summary get successfully",
          status: "success",
          data: orderSummary,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "stall summary fail",
          status: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new BarnService();
