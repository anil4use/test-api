const log = require("../../configs/logger.config");
const {
  titleCase,
  validateUSAMobileNumber,
  validateEmail,
} = require("../../utils/helpers/validator.utils");
const { removeNullUndefined } = require("../../utils/helpers/common.utils");
const serviceDao = require("../../daos/service.dao");
const serviceCategoryDao = require("../../daos/serviceCategory.dao");
const addressDao = require("../../daos/address.dao");
const orderDao = require("../../daos/order.dao");
const { servicePayment } = require("../../hook/payment");

class Service {
  async getAllServiceService(req, res) {
    try {
      const {
        minPrice,
        maxPrice,
        serviceCategoryId,
        keyWord,
        page,
        limit,
        sort,
      } = req.body;
      const result = await serviceDao.getAllServiceForUser(
        minPrice,
        maxPrice,
        serviceCategoryId,
        keyWord,
        page,
        limit,
        sort
      );

      //  const result = await serviceDao.getAllService();
      if (result.data) {
        return res.status(200).json({
          message: "services get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          message: "services not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICES]: ", error);
      throw error;
    }
  }
  //getServiceByServiceId
  async getServiceByServiceId(req, res) {
    try {
      const { serviceId } = req.body;

      if (!serviceId) {
        return res.status(200).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await serviceDao.getAllServiceByServiceIdForUser(
        serviceId
      );
      if (result.data) {
        return res.status(200).json({
          message: "services get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          message: "services not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICES]: ", error);
      throw error;
    }
  }
  //serviceEnquiryService
  async serviceEnquiryService(req, res) {
    try {
      const userId = req.userId;
      const { serviceId, name, email, message, contact } = req.body;

      if (!userId || !serviceId || !name || !email || !message || !contact) {
        return res.status(200).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      if (!validateUSAMobileNumber(contact)) {
        return res.status(201).json({
          message: "please enter valid phoneNumber",
          code: 201,
          status: "fail",
        });
      }

      if (!validateEmail(email)) {
        return res.status(201).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }

      const data = {
        userId,
        serviceId,
        name,
        email,
        message,
        contact,
      };
      const result = await serviceDao.addEnquiryDetail(data);
      if (result.data) {
        return res.status(200).json({
          message:
            "Your request has been received, and we will respond to you shortly",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "services enquiry creation fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICES]: ", error);
      throw error;
    }
  }
  //getAllServiceCategoryService
  async getAllServiceCategoryService(req, res) {
    try {
      const result = await serviceCategoryDao.getAllServiceCategoryForUser();
      if (result) {
        return res.status(200).json({
          message: "services category retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "services category not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [SERVICE SERVICE]: ", error);
      throw error;
    }
  }
  //createServiceOrderService
  async createServiceOrderService(req, res) {
    try {
      const { addressId, serviceId, servicePurchaseDay, serviceRentId } =
        req.body;
      console.log(addressId, serviceId, servicePurchaseDay);
      const userId = req.userId;
      if ((!userId || !serviceId || !servicePurchaseDay, serviceRentId)) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      let shippingInfo = {};
      if (addressId) {
        const isAddressExist = await addressDao.getAddressById(
          addressId,
          userId
        );

        shippingInfo = {
          firstName: isAddressExist.data.firstName,
          lastName: isAddressExist.data.lastName,
          email: isAddressExist.data.email,
          contact: isAddressExist.data.contact,
          zipCode: isAddressExist.data.zipCode,
          street: isAddressExist.data.street,
          state: isAddressExist.data.state,
          city: isAddressExist.data.city,
          country: isAddressExist.data.country,
        };
      }

      const isServiceExist = await serviceDao.getServiceById(serviceId);
      if (!isServiceExist.data) {
        return res.status(400).json({
          message: "service not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const serviceRental = await serviceDao.getRentalServiceSummaryById(
        serviceRentId
      );
      if (!serviceRental.data) {
        return res.status(400).json({
          message: "serviceRental not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      let name = isServiceExist?.data?.name;
      let discountPrice = 0;
      let originalPrice = isServiceExist?.data?.price;
      let discount = isServiceExist?.data?.discountPrice;
      let reducedPrice =
        originalPrice -
        (discountPrice = isServiceExist?.data?.discount
          ? isServiceExist?.data?.discountPrice
          : 0);
      let quantity = 1;
      let coverImage = isServiceExist?.data?.coverImage;
      let totalPrice = 0;
      const taxPrice = 0;
      let shippingPrice = result.data.shippingCharge;
      console.log("fffffffffffffffffffff", shippingPrice);
      totalPrice = reducedPrice;

      let vendor=null;
      const orderItem = {
        name,
        originalPrice,
        discount,
        quantity,
        reducedPrice,
        coverImage,
        totalPrice,
        service: serviceId,
        servicePurchaseDay,
        vendorId:vendor?isServiceExist?.data?.providedBy:isServiceExist?.data?.ownedByBarn,
        vendorType: null,
      };


      console.log("dddddddddddddddddddddd",orderItem);



      let ownedBy = isServiceExist?.data?.providedBy;
      const isAdmin = await adminDao.getById(ownedBy);
      if (isAdmin.data) {
        orderItem.vendorType = isAdmin.data.adminType;
      } else {
        ownedBy = isServiceExist?.data?.ownedByBarn;
        const barnDetail = await barnDao.getBarnById(ownedBy);
        if (barnDetail.data) {
          const barnOwner = await adminDao.getById(
            barnDetail.data.barnOwner
          );
          if (barnOwner.data) {
            orderItem.vendorType = barnOwner.data.adminType;
          }
        }
      }


      if (addressId) {
        totalPrice = reducedPrice + shippingPrice;
      } else {
        totalPrice = reducedPrice;
      }

      const data = {
        shippingInfo: shippingInfo,
        orderItems: orderItem,
        user: userId,
        couponPrice: 0,
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
        serviceRentId: serviceRentId,
      };

      const result = await orderDao.createOrder(data);
      const session = await servicePayment(result.data);
      if (result.data) {
        return res.status(200).json({
          message: "order created successfully",
          success: "success",
          code: 200,
          data: session,
        });
      } else {
        return res.status(201).json({
          message: "order creation fail",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ORDER SERVICE]: ", error);
      throw error;
    }
  }

  //servicePurchaseSummary
  async servicePurchaseSummary(req, res) {
    try {
      const { serviceId, servicePurchaseDay, addressId, serviceRentId } =
        req.body;

      const userId = req.userId;
      console.log("ffffffffff", userId);
      console.log(req.body);
      if (!userId || !serviceId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
        });
      }

      const isServiceExist = await serviceDao.getServiceById(serviceId);
      if (!isServiceExist.data) {
        return res.status(400).json({
          message: "service not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      let shippingPrice = 0;
      if (addressId) {
        shippingPrice = 12;
      }
      const updateData = {
        days: servicePurchaseDay,
        addressId,
      };

      const serviceData = {
        userId,
        serviceId,
        addressId,
        days: servicePurchaseDay,
        shippingCharge:shippingPrice,
      };

      let result = null;
      if (serviceRentId) {
        result = await serviceDao.updateServicePurchase(
          serviceRentId,
          updateData
        );
      } else {
        result = await serviceDao.createServicePurchase(serviceData);
      }

      let totalPrice = 0;
      let discountPrice = 0;
      let originalPrice = isServiceExist?.data?.price;
      let discount = isServiceExist?.data?.discountPrice;
      let reducedPrice =
        originalPrice -
        (discountPrice = isServiceExist?.data?.discount
          ? isServiceExist?.data?.discountPrice
          : 0);
      const taxPrice = 0;

      totalPrice = reducedPrice;

      if (result.data) {
        const totalItem = result.data.days;
        totalPrice = totalPrice * totalItem;
        const beforeTex = totalPrice + shippingPrice;
        const tax = 0;
        const orderTotal = beforeTex + tax;
        const serviceRentId = result.data.serviceRentId;
        const orderSummary = {
          items: totalItem,
          totalPrice: totalPrice,
          shipping: shippingPrice,
          beforeTex: beforeTex,
          taxCollected: tax,
          orderTotal: orderTotal,
          quantity: servicePurchaseDay,
          serviceRentId: serviceRentId,
        };

        return res.status(200).json({
          message: "service summary created successfully",
          status: "success",
          code: 200,
          data: orderSummary,
        });
      } else {
        return res.status(200).json({
          message: "service summary  creation error",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [SERVICE PURCHASE SERVICE]: ", error);
      throw error;
    }
  }

  //deleteServicePurchaseSummary
  async createServiceOrderService(req, res) {
    try {
      const { addressId, serviceId, servicePurchaseDay,serviceRentId } = req.body;
      console.log(addressId, serviceId, servicePurchaseDay);
      const userId = req.userId;
      if (!userId || !serviceId || !servicePurchaseDay) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      let shippingInfo = {};
      if (addressId) {
        const isAddressExist = await addressDao.getAddressById(
          addressId,
          userId
        );
        shippingInfo = {
          firstName: isAddressExist.data.firstName,
          lastName: isAddressExist.data.lastName,
          email: isAddressExist.data.email,
          contact: isAddressExist.data.contact,
          zipCode: isAddressExist.data.zipCode,
          street: isAddressExist.data.street,
          state: isAddressExist.data.state,
          city: isAddressExist.data.city,
          country: isAddressExist.data.country,
        };
      }

      const isServiceExist = await serviceDao.getServiceById(serviceId);
      if (!isServiceExist.data) {
        return res.status(400).json({
          message: "service not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }


      const isRentalServiceExist = await serviceDao.getRentalServiceSummaryById(serviceRentId);
      if (!isServiceExist.data) {
        return res.status(400).json({
          message: "service not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

     

      let name = isServiceExist?.data?.name;
      let discountPrice = 0;
      let originalPrice = isServiceExist?.data?.price;
      let discount = isServiceExist?.data?.discountPrice;
      let reducedPrice =
        originalPrice -
        (discountPrice = isServiceExist?.data?.discount
          ? isServiceExist?.data?.discountPrice
          : 0);
      let quantity = 1;
      let day = servicePurchaseDay;
      let coverImage = isServiceExist?.data?.coverImage;
      let totalPrice = 0;
      const taxPrice = 0;
      let shippingPrice = isRentalServiceExist?.data?.shippingCharge;

      if (addressId) {
        totalPrice = totalPrice + shippingPrice;
      } else {
        totalPrice = totalPrice;
      }
      totalPrice = reducedPrice * day+shippingPrice;
      const orderItem = {
        name,
        originalPrice,
        discount,
        quantity,
        reducedPrice,
        coverImage,
        totalPrice,
        service: serviceId,
        servicePurchaseDay,
      };

      const data = {
        shippingInfo: shippingInfo,
        orderItems: orderItem,
        user: userId,
        couponPrice: 0,
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
      };

      const result = await orderDao.createOrder(data);
      const session = await servicePayment(result.data);
      if (result.data) {
        return res.status(200).json({
          message: "order created successfully",
          success: "success",
          code: 200,
          data: session,
        });
      } else {
        return res.status(201).json({
          message: "order creation fail",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ORDER SERVICE]: ", error);
      throw error;
    }
  }

  //deleteServicePurchaseSummary
  async deleteServicePurchaseSummary(req, res) {
    try {
      const { serviceRentId } = req.body;

      const userId = req.userId;
      console.log("ffffffffff", userId);
      console.log(req.body);
      if (!userId || !serviceRentId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
        });
      }

      const isServiceExist = await serviceDao.getRentalServiceSummaryById(
        serviceRentId
      );
      if (!isServiceExist.data) {
        return res.status(400).json({
          message: "service not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const deleteSummary = await serviceDao.deleteRentalSummary(serviceRentId);
      if (deleteSummary.data) {
        return res.status(200).json({
          message: "summary deleted created successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "summary delete fail",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [SERVICE PURCHASE SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new Service();
