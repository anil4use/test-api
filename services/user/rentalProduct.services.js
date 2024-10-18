const log = require("../../configs/logger.config");
const productDao = require("../../daos/product.dao");
const userDao = require("../../daos/user.dao");
const rentalProductDao = require("../../daos/rentalProduct.dao");
const orderDao = require("../../daos/order.dao");
const { removeNullUndefined } = require("../../utils/helpers/common.utils");
const addressDao = require("../../daos/address.dao");
const { productPaymentHook, rentalProductHook } = require("../../hook/payment");
const adminDao = require("../../daos/admin.dao");
const barnDao = require("../../daos/barn.dao");
const { shippingRate } = require("../../utils/helpers/tracking.utils");
class RentalProductService {
  async rentalOrderSummary(req, res) {
    try {
      const { productId, quantity, days, addressId, rentId } = req.body;

      const userId = req.userId;
      console.log("ffffffffff", userId);
      console.log(req.body);
      if (!userId || !productId || !quantity || !days) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
        });
      }

      const isProductExist = await productDao.getProductById(productId);

      if (!isProductExist.data) {
        return res.status(400).json({
          message: "product not found",
          status: "fail",
          code: 201,
        });
      }

      const productInStock = isProductExist.data.quantity;

      if (productInStock < quantity) {
        return res.status(201).json({
          message: "product out of stock",
          status: "fail",
          code: 201,
        });
      }

      let shippingCharge = 0;

      if (addressId) {
        const isExistAddress = await addressDao.getAddressById(
          addressId,
          userId
        );
        if (!isExistAddress.data) {
          return res.status(400).json({
            message: "address not found",
            code: 201,
            data: null,
          });
        }

        let recipientAddress = null;

        recipientAddress = {
          streetLines: isExistAddress.data.street,
          city: isExistAddress.data.city,
          postalCode: (isExistAddress?.data?.zipCode).toString(),
          countryCode: "US",
          residential: true,
        };

        const admin = isProductExist?.data?.ownedBy;
        let vendorAddress = null;

        if (admin?.startsWith("Barn_")) {
          const barnDetail = await barnDao.getBarnById(admin);
          const barnAddress = await barnDao.getBarnAddress(
            barnDetail.data.location.latitude,
            barnDetail.data.location.longitude
          );

          const address = barnAddress.data;
          const addressDetail = address.split(",").map((part) => part.trim());

          const country = addressDetail[addressDetail.length - 1];
          const postalCode = addressDetail[addressDetail.length - 2];
          const state = addressDetail[addressDetail.length - 3];
          const city = addressDetail[addressDetail.length - 4];

          vendorAddress = {
            city: city,
            postalCode: postalCode,
            countryCode: "US",
            residential: false,
          };
        } else {
          const adminDetail = await adminDao.getById(admin);
          vendorAddress = {
            city: adminDetail.data.city,
            postalCode: adminDetail.data.zipCode,
            countryCode: "US",
            residential: false,
          };
        }

        const requestedPackageLineItems = Array(quantity).fill({
          weight: {
            units: "LB",
            value: parseFloat(isProductExist?.data?.weight).toFixed(1),
          },
        });

        const totalWeight = parseFloat(isProductExist?.data?.weight) * quantity;

        console.log(
          "ssssssssssss",
          vendorAddress,
          recipientAddress,
          requestedPackageLineItems,
          totalWeight
        );
        shippingCharge = await shippingRate(
          vendorAddress,
          recipientAddress,
          requestedPackageLineItems,
          totalWeight
        );
      }

      const updateData = {
        days,
        addressId,
        shippingCharge,
      };

      const rentalData = {
        userId,
        productId,
        quantity,
        days,
        addressId,
        shippingCharge,
      };

      let result = null;
      if (rentId) {
        result = await rentalProductDao.updateRentalProduct(rentId, updateData);
      } else {
        result = await rentalProductDao.createRentalProduct(rentalData);
      }
      console.log("ddddddddd", result.data);
      let discountPrice = 0;
      const price =
        isProductExist.data.price -
        (discountPrice = isProductExist.data.discount
          ? isProductExist.data.discountPrice
          : 0);

      if (result.data) {
        const totalItem = result.data.quantity;
        const totalPrice = price * totalItem * days;
        const orderTotal = totalPrice + result?.data?.shippingCharge;
        const rentId = result.data.rentId;

        const orderSummary = {
          items: totalItem,
          totalPrice: totalPrice,
          shipping: result?.data?.shippingCharge,

          // beforeTex: beforeTex,
          // taxCollected: tax,

          orderTotal: orderTotal,
          quantity: quantity,
          rentId: rentId,
        };

        return res.status(200).json({
          message: "rental created successfully",
          status: "success",
          code: 200,
          data: orderSummary,
        });
      } else {
        return res.status(200).json({
          message: "rental creation error",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [RENTAL PRODUCT SERVICE]: ", error);
      throw error;
    }
  }

  async productOnRentService(req, res) {
    try {
      const { productId, productOutDate, days, quantity, addressId, rentId } =
        req.body;

      const userId = req.userId;
      console.log("ffffffffff", userId);
      console.log(req.body);
      if (
        !userId ||
        !productId ||
        !days ||
        !quantity ||
        !productOutDate ||
        !rentId
      ) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
        });
      }
      const isProductExist = await productDao.getProductById(productId);

      if (!isProductExist.data) {
        return res.status(400).json({
          message: "product not found",
          status: "fail",
          code: 201,
        });
      }

      const productInStock = isProductExist.data.quantity;

      if (productInStock < quantity) {
        return res.status(201).json({
          message: "product out of stock",
          status: "fail",
          code: 201,
        });
      }
      let shippingInfo;

      if (addressId) {
        const isAddressExist = await addressDao.getAddressById(
          addressId,
          userId
        );
        if (!isAddressExist.data) {
          return res.status(404).json({
            message: "address not found",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        shippingInfo = {
          firstName: isAddressExist?.data?.firstName,
          lastName: isAddressExist?.data?.lastName,
          email: isAddressExist?.data?.email,
          contact: isAddressExist?.data?.contact,
          zipCode: isAddressExist?.data?.zipCode,
          street: isAddressExist?.data?.street,
          state: isAddressExist?.data?.state,
          city: isAddressExist?.data?.city,
          country: isAddressExist?.data?.country,
          stateOrProvinceCode: isAddressExist?.data?.stateOrProvinceCode,
        };
      }

      const rentalData = {
        userId,
        productId,
        productOutDate,
        days,
        quantity,
      };

      const result = await rentalProductDao.getRentalProduct(rentId);
      if (!result.data) {
        return res.status(201).json({
          message: "rental product detail not found",
          status: "fail",
          data: null,
          code: 201,
        });
      }

      const updateRent = await rentalProductDao.updateIsReturn(
        rentId,
        rentalData
      );

      let discountPrice = 0;
      const orderItem = {
        name: isProductExist.data.name,
        originalPrice: isProductExist.data.price,
        discount: isProductExist.data.discountPrice,
        reducedPrice:
          isProductExist.data.price -
          (discountPrice = isProductExist.data.discount
            ? isProductExist.data.discountPrice
            : 0),
        quantity: quantity,
        coverImage: isProductExist.data.coverImage,
        product: productId,
        vendorId: isProductExist.data.ownedBy,
        vendorType: null,
      };

      const ownedBy = isProductExist.data.ownedBy;
      const isAdmin = await adminDao.getById(ownedBy);
      if (isAdmin.data) {
        orderItem.vendorType = isAdmin.data.adminType;
      } else {
        const barnDetail = await barnDao.getBarnById(ownedBy);
        if (barnDetail.data) {
          const barnOwner = await adminDao.getById(barnDetail.data.barnOwner);
          if (barnOwner.data) {
            orderItem.vendorType = barnOwner.data.adminType;
          }
        }
      }

      const shippingPrice = result?.data?.shippingCharge;

      let taxPrice = 0;
      const totalPrice =
        (days * orderItem.reducedPrice * quantity) + shippingPrice;
      console.log(totalPrice);
      console.log("ffffffffffffffffffffffffffffffffffffff", totalPrice);
      const data = {
        shippingInfo: shippingInfo,
        orderItems: orderItem,
        user: userId,
        couponPrice: 0,
        taxPrice: taxPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
        rentalId: result.data.rentId,
      };

      const orderData = await orderDao.createOrder(data);
      console.log(orderData.data);
      const session = await rentalProductHook(orderData.data);
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
      log.error("error from [RENTAL PRODUCT SERVICE]: ", error);
      throw error;
    }
  }

  //deleteRentalProduct
  async deleteRentalProduct(req, res) {
    try {
      const { rentId } = req.body;

      const userId = req.userId;
      console.log("ffffffffff", userId);
      console.log(req.body);
      if (!userId || !rentId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
        });
      }
      const isRentExist = await rentalProductDao.getRentalProduct(rentId);

      if (!isRentExist.data) {
        return res.status(400).json({
          message: "rental summary not found",
          status: "fail",
          code: 201,
        });
      }

      const result = await rentalProductDao.deleteRentalProduct(rentId);
      console.log("fddddddddddddddddd", result.data);
      if (!result.data) {
        return res.status(201).json({
          message: "rental delete fail",
          status: "fail",
          data: null,
          code: 201,
        });
      } else {
        return res.status(201).json({
          message: "rental deleted successfully",
          status: "success",
          code: 200,
        });
      }
    } catch (error) {
      log.error("error from [RENTAL PRODUCT SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new RentalProductService();
