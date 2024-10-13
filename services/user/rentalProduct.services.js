const log = require("../../configs/logger.config");
const productDao = require("../../daos/product.dao");
const userDao = require("../../daos/user.dao");
const rentalProductDao = require("../../daos/rentalProduct.dao");
const orderDao = require("../../daos/order.dao");
const { removeNullUndefined } = require("../../utils/helpers/common.utils");
const addressDao = require("../../daos/address.dao");
const { productPaymentHook, rentalProductHook } = require("../../hook/payment");
class RentalProductService {
  async rentalOrderSummary(req, res) {
    try {
      const { productId, quantity, days, addressId, rentId } = req.body;

      const userId = req.userId;
      console.log("ffffffffff", userId);
      console.log(req.body);
      if (!userId || !productId || !quantity ||!addressId ||!days) {
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
      
      if(addressId){
        const isExistAddress=await addressDao.getAddressById(addressId);
        if(isExistAddress.data){
          return res.status(400).json({
            message:"address not found",
            code:201,
            data:null,
          })
        }
      }

        
      let shippingCharge = 0;

      if (addressId) {
        shippingCharge = 30;
      }

      const updateData={
        days,
        addressId,
        shippingCharge,
      }
      const rentalData = {
        userId,
        productId,
        quantity,
        days,
        addressId,
        shippingCharge
      };

      let result = null;
      if (rentId) {
        result = await rentalProductDao.updateRentalProduct(rentId,updateData);
      } else {
        result = await rentalProductDao.createRentalProduct(rentalData);
      }
      console.log("ddddddddd",result.data);
      let discountPrice = 0;
      const price =
        isProductExist.data.price -
        (discountPrice = isProductExist.data.discount
          ? isProductExist.data.discountPrice
          : 0);

      if (result.data) {
        const totalItem = result.data.quantity;
        const totalPrice = price * totalItem * days;
        const beforeTex = totalPrice + result?.data?.shippingCharge;
        const tax = 0;
        const orderTotal = beforeTex + tax;
        const rentId = result.data.rentId;
        const orderSummary = {
          items: totalItem,
          totalPrice: totalPrice,
          shipping: result?.data?.shippingCharge,
          beforeTex: beforeTex,
          taxCollected: tax,
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
        !addressId ||
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
      };
      const taxPrice = 0;
      const shippingPrice = result.data.shippingCharge;

      const totalPrice =
        days * orderItem.reducedPrice * quantity + taxPrice;
      console.log(totalPrice);
     console.log("ffffffffffffffffffffffffffffffffffffff",totalPrice);
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
      console.log("fddddddddddddddddd",result.data);
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