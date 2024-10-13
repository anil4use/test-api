const getNextSequenceValue = require("../utils/helpers/counter.utils");
const log = require("../configs/logger.config");
const cartModel = require("../models/cart/cart.model");
const productModel = require("../models/product/product.model");
const couponModel = require("../models/coupon.model");

class CartDao {
  async addCart(data) {
    try {
      const cartId = "CART_" + (await getNextSequenceValue("cart"));
      data.cartId = cartId;

      const cartInfo = new cartModel(data);
      const result = await cartInfo.save();
      log.info("cart saved");
      let response = {};
      if (result && result.item && result.item.length > 0) {
        response = await Promise.all(
          result.item.map(async (data) => {
            const productId = data.productId;
            const product = await productModel
              .findOne({ productId })
              .select("coverImage price name discount discountPrice");
            return {
              ...data.toObject(),
              product,
            };
          })
        );

        let totalPrice = 0;
        let totalDiscount = 0;
         console.log("fffffffffffffffffffffffffffff",response)
        response = response.map((item) => {
          const originalPrice = item.product?.price;
          const discountAmount = item.product.discount
            ? item.product.discountPrice
            : 0;
          const effectivePrice = item.product.discount
            ? originalPrice - discountAmount
            : originalPrice;
          totalDiscount += discountAmount * item.quantity;
          totalPrice += effectivePrice * item.quantity;

          return {
            ...item,
            discount: item.product.discount ? true : false,
            discountAmount,
            originalPrice,
            price: effectivePrice,
          };
        });

        const cartResponse = {
          cartId: result.cartId,
          userId: result.userId,
          item: response,
          totalPrice: totalPrice,
          totalDiscount: totalDiscount,
        };

        return {
          message: "cart created successfully",
          status: "success",
          code: 200,
          data: cartResponse,
        };
      } else {
        log.error("Error from [CART DAO] : cart creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [CART DAO] : ", error);
      throw error;
    }
  }
  //updateCart
  async updateCart(userId, cartData) {
    try {
      const currentCart = await cartModel
        .findOne({
          userId: userId,
          status: "Pending",
        })
        .sort({ _id: -1 });

      console.log(currentCart);

      currentCart.item = currentCart.item.map((existItem) => {
        const newItem = cartData.item.find(
          (item) => item.productId === existItem.productId
        );
        if (newItem) {
          existItem.quantity = newItem.quantity;
          cartData.item = cartData.item.filter(
            (item) => item.productId !== newItem.productId
          );
        }
        return existItem;
      });
      currentCart.item = currentCart.item.concat(cartData.item);
      const result = await currentCart.save();
      let response = null;
      if (result && result.item && result.item.length > 0) {
        response = await Promise.all(
          result.item.map(async (data) => {
            const productId = data.productId;
            const product = await productModel
              .findOne({ productId })
              .select("coverImage price name discount discountPrice");
            return {
              ...data.toObject(),
              product,
            };
          })
        );
        let totalPrice = 0;
        let totalDiscount = 0;

        response = response.map((item) => {
          const originalPrice = item.product.price;
          const discountAmount = item.product.discount
            ? item.product.discountPrice
            : 0;
          const effectivePrice = item.product.discount
            ? originalPrice - discountAmount
            : originalPrice;
          totalDiscount += discountAmount * item.quantity;
          totalPrice += effectivePrice * item.quantity;

          return {
            ...item,
            newPrice: effectivePrice,
          };
        });

        let couponDiscount = 0;
        if (result.couponId && result.isCouponApplied) {
          const coupon = await couponModel.findOne({
            couponId: result.couponId,
            assignedUsers: userId,
          });
          couponDiscount = coupon.discount;
          if (coupon && coupon.expiryDate > Date.now()) {
            totalPrice = totalPrice - coupon.discount;
          }
        }

        const cartResponse = {
          cartId: result.cartId,
          userId: result.userId,
          item: response,
          totalPrice: totalPrice,
          couponDiscount: couponDiscount,
          totalDiscount: totalDiscount + couponDiscount,
        };

        return {
          message: "cart update successfully",
          status: "success",
          code: 200,
          data: cartResponse,
        };
      } else {
        return {
          message: "cart update fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [cart DAO] : ", error);
      throw error;
    }
  }
  //getCartByUserIdAndStatus

  async getCartByUserIdAndStatus(userId) {
    try {
      const result = await cartModel.findOne({
        userId: userId,
      });
      let response = {};
      if (result && result.item && result.item.length > 0) {
        response = await Promise.all(
          result.item.map(async (data) => {
            const productId = data.productId;
            const product = await productModel
              .findOne({ productId })
              .select("coverImage price name discount discountPrice ownedBy");
            return {
              ...data.toObject(),
              product,
            };
          })
        );

        console.log(response);

        let totalPrice = 0;
        let totalDiscount = 0;

        response = response.map((item) => {
          const originalPrice = item.product.price;
          const discountAmount = item.product.discount
            ? item.product.discountPrice
            : 0;
          const effectivePrice = originalPrice - discountAmount;
          return {
            ...item,
            originalPrice,
            totalPrice: Number(effectivePrice.toFixed(2)),
          };
        });

        console.log(response);
        const grandTotal = response.map((item) => {
          console.log(item.quantity);
          return Number(item.totalPrice) * Number(item.quantity);
        });
        console.log("grand total", grandTotal);
        let sum = 0;

        for (let i = 0; i < grandTotal.length; i++) {
          sum += grandTotal[i];
        }

        console.log("total sum", sum);
        const cartResponse = {
          cartId: result.cartId,
          userId: result.userId,
          item: response,
          totalPrice: Number(sum.toFixed(2)),
        };

        return {
          message: "cart get successfully",
          status: "success",
          code: 200,
          data: cartResponse,
        };
      } else if (result && result.item.length === 0) {
        return {
          message: "cart get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "cart not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [CART DAO] : ", error);
      throw error;
    }
  }

  async getCartByUserId(userId) {
    try {
      const result = await cartModel.findOne({
        userId: userId,
      });
      let response = {};
      if (result && result.item && result.item.length > 0) {
        response = await Promise.all(
          result.item.map(async (data) => {
            const productId = data.productId;
            const product = await productModel
              .findOne({ productId })
              .select("coverImage price name discount discountPrice");
            return {
              ...data.toObject(),
              product,
            };
          })
        );

        console.log("cccccccccccccccccccccccccccccccccccc",response);

        let totalPrice = 0;
        let totalDiscount = 0;

        response = response.map((item) => {
          const originalPrice = item.product.price;
          const discountAmount = item.product.discount
            ? item.product.discountPrice
            : 0;
          const effectivePrice = originalPrice - discountAmount;
          return {
            ...item,
            originalPrice,
            totalPrice: Number(effectivePrice.toFixed(2)),
          };
        });

        console.log(response);
        const grandTotal = response.map((item) => {
          console.log(item.quantity);
          return Number(item.totalPrice) * Number(item.quantity);
        });
        console.log("grand total", grandTotal);
        let sum = 0;

        for (let i = 0; i < grandTotal.length; i++) {
          sum += grandTotal[i];
        }

        console.log("total sum", sum);
        const cartResponse = {
          cartId: result.cartId,
          userId: result.userId,
          item: response,
          totalPrice: Number(sum.toFixed(2)),
        };

        return {
          message: "cart get successfully",
          status: "success",
          code: 200,
          data: cartResponse,
        };
      } else if (result && result.item.length === 0) {
        return {
          message: "cart get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "cart not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [CART DAO] : ", error);
      throw error;
    }
  }
  //getCartByIdAndUserId
  async getCartByIdAndUserId(userId, cartId) {
    try {
      const result = await cartModel.findOne({
        cartId: cartId,
        userId: userId,
        status: "Pending",
      });
      if (result) {
        return {
          message: "cart get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "cart get fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [CART DAO] : ", error);
      throw error;
    }
  }
  //getCartById
  async getCartById(cartId) {
    try {
      const result = await cartModel.findOne({ cartId });
      if (result) {
        return {
          message: "cart get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "cart not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [CART DAO] : ", error);
      throw error;
    }
  }
  //removeProductFromCart
  async removeProductFromCart(cartId, productId) {
    try {
      const result = await cartModel.findOneAndUpdate(
        { cartId },
        { $pull: { item: { productId } } },
        { new: true }
      );
      console.log(result);

      if (result) {
        return {
          message: "product removed from cart",
          success: "success",
          code: 200,
          data: result,
        };
      }

      //     console.log(result);
      // if(result.item.length===0){
      //   return {
      //     message: "product remove successfully",
      //     status: "success",
      //     code: 200,
      //     data:[],
      //   };
      // }
      // console.log(result);
      // let response = [];

      // if (result && result.item && result.item.length > 0){
      //   response = await Promise.all(
      //     result.item.map(async (data) => {
      //       const productId = data.productId;
      //       const product = await productModel
      //         .findOne({ productId })
      //         .select("coverImage price name discount discountPrice");
      //       return {
      //         ...data.toObject(),
      //         product,
      //       };
      //     })
      //   );
      //   let totalPrice = 0;
      //   let totalDiscount = 0;

      //   response = response.map((item) => {
      //     const originalPrice = item.product.price;
      //     const discountAmount = item.product.discount
      //       ? item.product.discountPrice
      //       : 0;
      //     const effectivePrice = item.product.discount
      //       ? originalPrice - discountAmount
      //       : originalPrice;
      //     totalDiscount += discountAmount * item.quantity;
      //     totalPrice += effectivePrice * item.quantity;

      //     return {
      //       ...item,
      //       newPrice: effectivePrice,
      //     };
      //   });

      //   const cartResponse = {
      //     cartId: result.cartId,
      //     userId: result.userId,
      //     items: response,
      //     totalPrice: totalPrice,
      //     totalDiscount: totalDiscount,
      //   };
      //   console.log(cartResponse);
      //   return {
      //     message: "Product removed successfully",
      //     status: "success",
      //     code: 200,
      //     data: cartResponse,
      //   };
      //}
    } catch (error) {
      log.error("Error from [CART DAO] : ", error);
      throw error;
    }
  }
  //updateCartForCoupon
  async updateCartForCoupon(userId, couponCode, data) {
    try {
      console.log(couponCode, userId, data);
      const result = await cartModel
        .findOneAndUpdate(
          {
            userId: userId,
            status: "Pending",
          },
          data,
          {
            new: true,
          }
        )
        .sort({ _id: -1 });

      console.log(result);

      let response = null;
      if (result && result.item && result.item.length > 0) {
        response = await Promise.all(
          result.item.map(async (data) => {
            const productId = data.productId;
            const product = await productModel
              .findOne({ productId })
              .select("coverImage price name discount discountPrice");
            return {
              ...data.toObject(),
              product,
            };
          })
        );
        console.log(response);
        let totalPrice = 0;
        let totalDiscount = 0;

        response = response.map((item) => {
          const originalPrice = item.product.price;
          const discountAmount = item.product.discount
            ? item.product.discountPrice
            : 0;
          const effectivePrice = item.product.discount
            ? originalPrice - discountAmount
            : originalPrice;
          totalDiscount += discountAmount * item.quantity;
          totalPrice += effectivePrice * item.quantity;

          return {
            ...item,
            newPrice: effectivePrice,
          };
        });

        const coupon = await couponModel.findOne({
          couponCode: couponCode,
          assignedUsers: userId,
        });
        console.log(coupon.discount);
        console.log(result.isCouponApplied);
        if (result.isCouponApplied) {
          if (coupon && coupon.expiryDate > Date.now()) {
            totalPrice = totalPrice - coupon.discount;
          } else {
            return {
              message: "coupon has expired",
              success: "fail",
              code: 201,
              data: null,
            };
          }
        }
        console.log(totalPrice);
        const cartResponse = {
          cartId: result.cartId,
          userId: result.userId,
          item: response,
          totalPrice: totalPrice,
          couponDiscount: result.isCouponApplied ? coupon.discount : 0,
          totalDiscount: totalDiscount + coupon.discount,
        };

        return {
          message: "coupon applied successfully",
          status: "success",
          code: 200,
          data: cartResponse,
        };
      } else {
        return {
          message: "coupon applied fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [cart DAO] : ", error);
      throw error;
    }
  }
  //removeCoupon
  async removeCoupon(userId, data) {
    try {
      console.log(userId, data);
      const result = await cartModel
        .findOneAndUpdate(
          {
            userId: userId,
            status: "Pending",
          },
          data,
          {
            new: true,
          }
        )
        .sort({ _id: -1 });

      console.log(result);

      let response = null;
      if (result && result.item && result.item.length > 0) {
        response = await Promise.all(
          result.item.map(async (data) => {
            const productId = data.productId;
            const product = await productModel
              .findOne({ productId })
              .select("coverImage price name discount discountPrice");
            return {
              ...data.toObject(),
              product,
            };
          })
        );
        let totalPrice = 0;
        let totalDiscount = 0;

        response = response.map((item) => {
          const originalPrice = item.product.price;
          const discountAmount = item.product.discount
            ? item.product.discountPrice
            : 0;
          const effectivePrice = item.product.discount
            ? originalPrice - discountAmount
            : originalPrice;
          totalDiscount += discountAmount * item.quantity;
          totalPrice += effectivePrice * item.quantity;

          return {
            ...item,
            newPrice: effectivePrice,
          };
        });

        const cartResponse = {
          cartId: result.cartId,
          userId: result.userId,
          item: response,
          totalPrice: totalPrice,
          couponDiscount: 0,
          totalDiscount: totalDiscount,
        };

        return {
          message: "coupon removed successfully",
          status: "success",
          code: 200,
          data: cartResponse,
        };
      } else {
        return {
          message: "coupon remove fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [cart DAO] : ", error);
      throw error;
    }
  }
  //resetCart
  async resetCart(cartId) {
    try {
      const result = await cartModel.findOneAndUpdate(
        { cartId },
        { $set: { item: [], isCouponApplied: false, couponId: null } },
        { new: true }
      );

      if (result) {
        return {
          message: "cart reset successfully",
          success: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [CART DAO] : ", error);
      throw error;
    }
  }
  //resetCartByUserId

  async resetCartByUserId(userId) {
    try {
      const result = await cartModel.findOneAndUpdate(
        { userId },
        { $set: { item: [] } },
        { new: true }
      );

      if (result) {
        return {
          message: "cart reset successfully",
          success: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [CART DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new CartDao();
