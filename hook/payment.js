const log = require("../configs/logger.config");
const {
  STRIPE_SECRET_KEY,
  WEB_HOOK_SECRET,
  RENTAL_WEB_HOOK_SECRET,
  SUBSCRIPTION_PAYMENT_WEB_HOOK_SECRET,
  SERVICE_PAYMENT_WEB_HOOK_SECRET,
  RENTAL_SPACE_WEB_HOOK_SECRET,
  successUrl,
  cancelUrl,
  BASE_URL,
} = require("../configs/server.config");
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const userDao = require("../daos/user.dao");
const productDao = require("../daos/product.dao");
const cartDao = require("../daos/cart.dao");
const productModel = require("../models/product/product.model");
const orderDao = require("../daos/order.dao");
const subscriptionDao = require("../daos/subscription.dao");
const productInvoice = require("../utils/helpers/invoice.utils");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
const moment = require("moment-timezone");
const { randomString } = require("../utils/helpers/common.utils");
const barnDao = require("../daos/barn.dao");
const paymentDao = require("../daos/payment.dao");
const adminDao = require("../daos/admin.dao");
const { createShippingRequest } = require("../utils/helpers/tracking.utils");

class PaymentHook {
  async productPaymentHook(result) {
    try {
      let response = await Promise.all(
        result.orderItems.map(async (item) => {
          const name = item.name;
          const price = item.reducedPrice;
          const quantity = item.quantity;
          const image = item.coverImage;
          return {
            name: name,
            price: price,
            userQ: quantity,
            image: image,
          };
        })
      );

      const lineItems = response.map((pro) => ({
        price_data: {
          currency: "inr", //make it to user

          product_data: {
            name: pro?.name,
            images: [pro?.image],
          },
          unit_amount: Math.round(pro.price * 100),
        },
        quantity: pro?.userQ,
      }));

      console.log("line itemssssssss", lineItems);

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        metadata: {
          order_id: result.orderId,
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: Math.round(result.shippingPrice * 100),
                currency: "inr",
              },
              display_name: "Shipping Amount",
            },
          },
        ],
        automatic_tax: {
          enabled: false,
        },
        mode: "payment",
        success_url: `${BASE_URL}/successUrl`,
        cancel_url: `${BASE_URL}/cancelUrl`,
      });

      return {
        message: "successfully",
        success: "success",
        code: 200,
        data: session,
      };
    } catch (error) {
      log.error("error from [PAYMENT HOOK]: ", error);
      throw error;
    }
  }

  async productWebHook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, WEB_HOOK_SECRET);
      } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.sendStatus(400);
      }
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          await handleCheckoutSessionCompleted(session);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      let paymentId = event.data.object.payment_intent;
      let orderId = event.data.object.metadata.order_id;
      let paymentStatus = event.data.object.payment_status;
      console.log("dddddddddddddddddddddddddddddddddddddd", paymentStatus);
      let timestamp = null;

      let userId = null;
      async function handleCheckoutSessionCompleted(session) {}
      if (paymentStatus == "paid") {
        const totalPrice = 0;
        const order = await orderDao.getOrderById(orderId);
        if (!order.data) {
          return res.status({
            message: "order not exist",
            success: "fail",
            code: 201,
            data: null,
          });
        }

        const orderDetails = order.data;
        const userId = orderDetails.user;
        const address = orderDetails.shippingInfo;
        console.log("sd", address);
        const itemId = orderDetails.orderItems[0]._id;

        const recipientAddress = {
          streetLines: address?.street,
          postalCode: (address?.zipCode).toString(),
          city: address.city,
          stateOrProvinceCode: address?.stateOrProvinceCode,
          personName: `${address?.firstName} ${address?.lastName}`,
          phoneNumber: (address?.contact).toString(),
        };

        console.log("rrrrrrrrrrrrrrrrrrrr", recipientAddress);
        let shippingDetail = null;

        for (const item of orderDetails?.orderItems) {
          const product = await productDao.getProductById(item?.product);
          const admin = product?.data?.ownedBy;
          let vendorAddress;
          console.log("hhhhhhhhhhhhhhh", admin);
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
            console.log(typeof postalCode);

            vendorAddress = {
              streetLines: barnDetail?.data?.contact?.address,
              postalCode: postalCode,
              city: city,
              stateOrProvinceCode:
                barnDetail?.data?.contact?.stateOrProvinceCode,
              personName: barnDetail?.data?.name,
              phoneNumber: barnDetail?.data?.contact?.phoneNumber,
            };
          } else {
            console.log("asdmin aidddddddddd", admin);
            const adminDetail = await adminDao.getById(admin);
            console.log("admin", adminDetail.data);
            console.log("sssssssssssssssssssss", adminDetail?.data?.name);
            vendorAddress = {
              streetLines: adminDetail.data.pickupAddress,
              city: adminDetail.data.city,
              postalCode: adminDetail.data.zipCode.toString(),
              stateOrProvinceCode: adminDetail.data.stateOrProvinceCode,
              personName: adminDetail?.data?.name,
              phoneNumber: adminDetail?.data?.contact,
            };
          }

          const requestedPackageLineItems = Array(item.quantity).fill({
            weight: {
              units: "LB",
              value: parseFloat(product?.data?.weight).toFixed(1),
            },
          });

          console.log("sssssssssss", vendorAddress, recipientAddress);

          const totalWeight = parseFloat(product?.data?.weight) * item.quantity;
          shippingDetail = await createShippingRequest(
            vendorAddress,
            recipientAddress,
            requestedPackageLineItems,
            totalWeight
          );

          const trackingNumber =
            shippingDetail.transactionShipments[0].pieceResponses[0]
              .trackingNumber;

          const level =
            shippingDetail.transactionShipments[0].pieceResponses[0]
              .packageDocuments[0].url;

          const order = await orderDao.updateTrackingDetail(
            orderId,
            itemId,
            trackingNumber,
            level
          );
        }

        const vendorPayouts = orderDetails.orderItems.reduce((acc, item) => {
          const { vendorId, vendorType, reducedPrice, quantity } = item;
          const totalAmount = reducedPrice * quantity;
          const commission = reducedPrice * 0.05 * quantity;
          const amountAfterCommission = totalAmount - commission;
          if (!acc[vendorId]) acc[vendorId] = { vendorType, totalAmount: 0 };
          acc[vendorId].totalAmount += amountAfterCommission;
          return acc;
        }, {});

        console.log("vendor payout ", vendorPayouts);

        await Promise.all(
          orderDetails.orderItems.map(async (item) => {
            const productId = item.product;
            const quantity = item.quantity;
            const updatedProduct = await productDao.updateProductQuantity(
              productId,
              quantity
            );
          })
        );

        const transactionDate = moment
          .unix(timestamp)
          .tz("America/New_York")
          .format("YYYY-MM-DD");

        let paidAt = Date.now();

        const data = {
          paymentId: paymentId,
          orderStatus: paymentStatus,
          paidAt: Date.now(),
          orderType: "product",
        };
        const updatedOrder = await orderDao.updatedOrder(orderId, data);

        const update = await Promise.all(
          Object.entries(vendorPayouts).map(
            async ([vendorId, { vendorType, totalAmount }]) => {
              await paymentDao.getOrCreateVendorWallet(vendorId, totalAmount);
              await paymentDao.createPayout(
                orderId,
                vendorId,
                totalAmount,
                vendorType
              );
            }
          )
        );

        const updateCart = await cartDao.resetCartByUserId(userId);

        await Promise.all(
          Object.entries(vendorPayouts).map(
            async ([vendorId, { vendorType, totalAmount }]) => {
              let email;
              console.log("vvvvvvvvvvvvvvvvvvv", vendorType);
              if (vendorType === "barnOwner") {
                console.log("vendorType", vendorId);
                const getBarnDetail = await barnDao.getBarnById(vendorId);
                console.log("fffffffffffff", getBarnDetail.data.barnOwner);
                const adminDetail = await adminDao.getById(
                  getBarnDetail.data.barnOwner
                );
                console.log("sdgagga", adminDetail.data);
                email = adminDetail.data.email;
                console.log("eeeeeeeeeeeeeeemaillllllllllllllll", email);
                await paymentDao.processVendorPayout(
                  adminDetail.data.staffId,
                  email,
                  totalAmount
                );
              } else {
                const adminDetail = await adminDao.getById(vendorId);
                email = adminDetail.data.email;
                await paymentDao.processVendorPayout(
                  vendorId,
                  email,
                  totalAmount
                );
              }
            }
          )
        );

        const seq = await getNextSequenceValue("payment");
        const invoiceNumber = "#INV" + seq;

        // const invoiceUrl = await productInvoice(
        //   invoiceNumber,
        //   paidAt,
        //   "etayas",
        //   address,
        //   location,
        //   contact,
        //   paymentId,
        //   userId,
        //   itemDescription,
        //   quantity,
        //   rate,
        //   taxRate,
        //   discount,
        //   paymentType,
        // );
        // console.log(invoiceUrl);

        return res.status(200).json({
          message: "details updated successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "update fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [PAYMENT HOOK]: ", error);
      throw error;
    }
  }

  //rentalProductHook
  async rentalProductHook(result) {
    try {
      let response = await Promise.all(
        result.orderItems.map(async (item) => {
          const name = item.name;
          const quantity = item.quantity;
          const price = item.reducedPrice;
          const image = item.coverImage;
          return {
            name: name,
            userQ: quantity,
            image: image,
            price: price,
          };
        })
      );

      const lineItems = response.map((pro) => ({
        price_data: {
          currency: "inr", //make it to user

          product_data: {
            name: pro?.name,
            images: [pro?.image],
          },
          unit_amount: Math.round(pro.price * 100),
        },
        quantity: pro?.userQ,
      }));

      console.log("line itemssssssss", lineItems);

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        metadata: {
          order_id: result.orderId,
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: Math.round(result.shippingPrice * 100),
                currency: "inr",
              },
              display_name: "Shipping Amount",
            },
          },
        ],
        automatic_tax: {
          enabled: false,
        },
        mode: "payment",
        success_url: `${BASE_URL}/successUrl`,
        cancel_url: `${BASE_URL}/cancelUrl`,
      });

      return {
        message: "successfully",
        success: "success",
        code: 200,
        data: session,
      };
    } catch (error) {
      log.error("error from [PAYMENT HOOK]: ", error);
      throw error;
    }
  }

  async rentalProductWebHook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];
      console.log(sig);
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          RENTAL_WEB_HOOK_SECRET
        );
        console.log(event);
        console.log(event.data.object.payment_intent);
      } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.sendStatus(400);
      }

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          console.log(session);
          await handleCheckoutSessionCompleted(session);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      console.log(event.data.object.payment_intent);
      let paymentId = event.data.object.payment_intent;
      let orderId = event.data.object.metadata.order_id;
      let paymentStatus = event.data.object.payment_status;
      console.log("payment iD<DDDDDDD", paymentId);
      console.log("status.....", paymentStatus);
      console.log("orderrrrrrrrrrrrrr", orderId);

      let userId = null;
      async function handleCheckoutSessionCompleted(session) {}

      if (paymentStatus == "paid") {
        const totalPrice = 0;
        const order = await orderDao.getOrderById(orderId);
        console.log(order.data);
        if (!order.data) {
          return res.status({
            message: "order not exist",
            success: "fail",
            code: 201,
            data: null,
          });
        }

        const orderDetails = order.data;
        const userId = orderDetails.user;
        console.log(orderDetails.user);
        console.log(userId);

        const address = orderDetails?.shippingInfo;
        console.log("sd", address);
        let shippingDetail = null;

        if (address) {
          const itemId = orderDetails.orderItems[0]._id;
          const recipientAddress = {
            streetLines: address?.street,
            postalCode: (address?.zipCode).toString(),
            city: address.city,
            stateOrProvinceCode: address?.stateOrProvinceCode,
            personName: `${address?.firstName} ${address?.lastName}`,
            phoneNumber: (address?.contact).toString(),
          };

          for (const item of orderDetails?.orderItems) {
            const product = await productDao.getProductById(item?.product);
            const admin = product?.data?.ownedBy;
            let vendorAddress;

            if (admin?.startsWith("Barn_")) {
              const barnDetail = await barnDao.getBarnById(admin);
              const barnAddress = await barnDao.getBarnAddress(
                barnDetail.data.location.latitude,
                barnDetail.data.location.longitude
              );
              const address = barnAddress.data;
              const addressDetail = address
                .split(",")
                .map((part) => part.trim());
              const country = addressDetail[addressDetail.length - 1];
              const postalCode = addressDetail[addressDetail.length - 2];
              const state = addressDetail[addressDetail.length - 3];
              const city = addressDetail[addressDetail.length - 4];
              console.log(typeof postalCode);

              vendorAddress = {
                streetLines: barnDetail?.data?.contact?.address,
                postalCode: postalCode,
                city: city,
                stateOrProvinceCode:
                  barnDetail?.data?.contact?.stateOrProvinceCode,
                personName: barnDetail?.data?.name,
                phoneNumber: barnDetail?.data?.contact?.phoneNumber,
              };
            } else {
              const adminDetail = await adminDao.getById(admin);
              vendorAddress = {
                streetLines: adminDetail.data.pickupAddress,
                city: adminDetail.data.city,
                postalCode: adminDetail.data.zipCode.toString(),
                stateOrProvinceCode: adminDetail.data.stateOrProvinceCode,
                personName: adminDetail?.data?.name,
                phoneNumber: adminDetail?.data?.contact,
              };
            }

            const requestedPackageLineItems = Array(item.quantity).fill({
              weight: {
                units: "LB",
                value: parseFloat(product?.data?.weight).toFixed(1),
              },
            });

            const totalWeight =
              parseFloat(product?.data?.weight) * item.quantity;
            shippingDetail = await createShippingRequest(
              vendorAddress,
              recipientAddress,
              requestedPackageLineItems,
              totalWeight
            );

            const trackingNumber =
              shippingDetail.transactionShipments[0].pieceResponses[0]
                .trackingNumber;

            const level =
              shippingDetail.transactionShipments[0].pieceResponses[0]
                .packageDocuments[0].url;

            const order = await orderDao.updateTrackingDetail(
              orderId,
              itemId,
              trackingNumber,
              level
            );
          }
        }

        const data = {
          paymentId: paymentId,
          orderStatus: paymentStatus,
          paidAt: Date.now(),
          orderType: "rentalProduct",
        };

        const updatedOrder = await orderDao.updatedOrder(orderId, data);
        console.log(updatedOrder);

        await Promise.all(
          orderDetails.orderItems.map(async (item) => {
            const productId = item.product;
            const quantity = item.quantity;
            const updatedProduct = await productDao.updateProductQuantity(
              productId,
              quantity
            );
          })
        );

        return res.status(200).json({
          message: "details updated successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "update fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [PAYMENT HOOK]: ", error);
      throw error;
    }
  }

  //subscriptionPayment
  async subscriptionPayment(result) {
    try {
      const subDetail = await subscriptionDao.getSubscriptionById(
        result.subsnId
      );
      const lineItems = [
        {
          price_data: {
            currency: "inr", //make it to user

            product_data: {
              name: subDetail.data.planName,
            },
            unit_amount: Math.round(result.totalPrice * 100),
          },
          quantity: 1,
        },
      ];

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        metadata: {
          order_id: result.orderId,
        },
        automatic_tax: {
          enabled: false,
        },
        mode: "payment",
        success_url: `${BASE_URL}/successUrl`,
        cancel_url: `${BASE_URL}/cancelUrl`,
      });
      return {
        message: "successfully",
        success: "success",
        code: 200,
        data: session,
      };
    } catch (error) {
      log.error("error from [SUBSCRIPTION PAYMENT]: ", error);
      throw error;
    }
  }

  //subscriptionPayment
  async subscriptionPaymentWebHook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];
      console.log(sig);
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          SUBSCRIPTION_PAYMENT_WEB_HOOK_SECRET
        );
        console.log(event);
        console.log(event.data.object.payment_intent);
      } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.sendStatus(400);
      }

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          console.log(session);
          await handleCheckoutSessionCompleted(session);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      console.log(event.data.object.payment_intent);
      let paymentId = event.data.object.payment_intent;
      let orderId = event.data.object.metadata.order_id;
      let paymentStatus = event.data.object.payment_status;
      console.log(paymentId);
      console.log(paymentStatus);
      console.log(orderId);

      async function handleCheckoutSessionCompleted(session) {}

      if (paymentStatus == "paid") {
        const totalPrice = 0;
        const order = await orderDao.getOrderById(orderId);
        console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", order.data);
        if (!order.data) {
          return res.status({
            message: "order not exist",
            success: "fail",
            code: 201,
            data: null,
          });
        }

        const data = {
          paymentId: paymentId,
          orderStatus: paymentStatus,
          paidAt: Date.now(),
          orderType: "subscription",
        };
        const updatedOrder = await orderDao.updatedOrder(orderId, data);
        console.log(updatedOrder);

        return res.status(200).json({
          message: "details updated successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "update fail",
          status: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [PAYMENT HOOK]: ", error);
      throw error;
    }
  }

  //service payment

  async servicePayment(result) {
    try {
      let response = await Promise.all(
        result.orderItems.map(async (item) => {
          const name = item.name;
          const price = item.reducedPrice;
          const quantity = item.quantity;
          const image = item.coverImage;
          const noOfDay = item.servicePurchaseDay;
          return {
            name: name,
            price: price,
            userQ: quantity,
            image: image,
            noOfDay: noOfDay,
          };
        })
      );
      let price = Math.round(response[0].price * response[0].noOfDay * 100);
      const lineItems = response.map((pro) => ({
        price_data: {
          currency: "inr", //make it to user

          product_data: {
            name: pro?.name,
            images: [pro?.image],
          },
          unit_amount: price,
        },
        quantity: 1,
      }));

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        metadata: {
          order_id: result.orderId,
          noOfDay: response[0].noOfDay,
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: Math.round(result?.shippingPrice * 100),
                currency: "inr",
              },
              display_name: "Shipping Amount",
            },
          },
        ],
        automatic_tax: {
          enabled: false,
        },
        mode: "payment",
        success_url: `${BASE_URL}/successUrl`,
        cancel_url: `${BASE_URL}/cancelUrl`,
      });

      return {
        message: "successfully",
        success: "success",
        code: 200,
        data: session,
      };
    } catch (error) {
      log.error("error from [SERVICE PAYMENT]: ", error);
      throw error;
    }
  }

  //servicePaymentHook
  async servicePaymentWebHook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          SERVICE_PAYMENT_WEB_HOOK_SECRET
        );
      } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.sendStatus(400);
      }

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          await handleCheckoutSessionCompleted(session);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      console.log(event.data.object.payment_intent);
      let paymentId = event.data.object.payment_intent;
      let orderId = event.data.object.metadata.order_id;
      console.log(orderId);
      let day = event.data.object.metadata.noOfDay;
      let paymentStatus = event.data.object.payment_status;
      const orderDetail = await orderDao.getOrderById(orderId);
      console.log("order detailstoooooooo", orderDetail);

      let userId = null;
      async function handleCheckoutSessionCompleted(session) {
        console.log("grdsaaaaa");
      }

      if (paymentStatus == "paid") {
        const totalPrice = 0;
        let name = null;
        let originalPrice = null;
        let discount = null;
        let reducedPrice = null;
        let quantity = null;
        let servicePurchaseDay = null;

        let details = await Promise.all(
          orderDetail.data.orderItems.map(async (item) => {
            name = item.name;
            originalPrice = item.originalPrice;
            servicePurchaseDay = item.servicePurchaseDay;
            quantity = item.quantity;
            discount = item.discount;
          })
        );

        if (!orderDetail.data) {
          return res.status({
            message: "order not exist",
            success: "fail",
            code: 201,
            data: null,
          });
        }

        let paidAt = Date.now();
        let data = {
          paymentId: paymentId,
          orderStatus: paymentStatus,
          paidAt: Date.now(),
          orderType: "service",
        };

        const updatedOrder = await orderDao.updatedOrder(orderId, data);
        console.log(updatedOrder);
        const seq = await getNextSequenceValue("payment");
        const invoice = "#INV" + seq;
        let address = "park avanue indore";
        let contact = 6985524510;
        let companyDetail =
          "barn connect \n14B,Northern Street\nGreater South Avenue\nNew York 10001\nU.S.A";
        let subTotal = orderDetail.data.totalPrice;
        let texPrice = orderDetail.data.taxPrice;
        let total = subTotal + texPrice;
        userId = orderDetail.data.user;
        const invoiceUrl = await productInvoice(
          companyDetail,
          invoice,
          paidAt,
          name,
          address,
          contact,
          paymentId,
          userId,
          texPrice,
          discount,
          subTotal,
          total,
          quantity,
          "Online"
        );

        data = {
          invoiceUrl,
        };
        await orderDao.updatedOrder(orderId, data);

        return res.status(200).json({
          message: "details updated successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "update fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [PAYMENT HOOK]: ", error);
      throw error;
    }
  }

  //rentalSpacePayment
  async rentalSpacePayment(result, barnRentalId) {
    try {
      let response = await Promise.all(
        result.orderItems.map(async (item) => {
          const name = item.name;
          const quantity = item.quantity;
          const image = item.coverImage;
          const price = item.reducedPrice;
          return {
            name: name,
            userQ: quantity,
            image: image,
            price: price,
          };
        })
      );

      const lineItems = response.map((pro) => ({
        price_data: {
          currency: "inr", //make it to user

          product_data: {
            name: pro?.name,
            images: [pro?.image],
          },
          unit_amount: Math.round(pro.price * 100),
        },
        quantity: pro?.userQ,
      }));

      console.log("line itemssssssss", lineItems);

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        metadata: {
          order_id: result.orderId,
          barnRentalId: barnRentalId,
        },

        automatic_tax: {
          enabled: false,
        },
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return {
        message: "successfully",
        success: "success",
        code: 200,
        data: session,
      };
    } catch (error) {
      log.error("error from [PAYMENT HOOK]: ", error);
      throw error;
    }
  }

  async rentalSpacePaymentWebHook(req, res) {
    try {
      const sig = req.headers["stripe-signature"];
      let event;
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          RENTAL_SPACE_WEB_HOOK_SECRET
        );
      } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.sendStatus(400);
      }

      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          await handleCheckoutSessionCompleted(session);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      let paymentId = event.data.object.payment_intent;
      let orderId = event.data.object.metadata.order_id;
      let barnRentalId = event.data.object.metadata.barnRentalId;
      let paymentStatus = event.data.object.payment_status;
      let timestamp = null;
      console.log("bbbbbbbbbbbbbbbbbbbbbbbbb", event.created);
      let userId = null;
      async function handleCheckoutSessionCompleted(session) {}

      if (paymentStatus == "paid") {
        console.log("dfsssssssssss");
        const totalPrice = 0;
        const order = await orderDao.getOrderById(orderId);
        console.log(order.data);
        if (!order.data) {
          return res.status({
            message: "order not exist",
            success: "fail",
            code: 201,
            data: null,
          });
        }

        const isExistRental = await barnDao.getRentalSpaceById(barnRentalId);
        if (!isExistRental.data) {
          return res.status({
            message: "rental detail not found",
            success: "fail",
            code: 201,
            data: null,
          });
        }

        const orderDetails = order.data;
        const userId = orderDetails.user;
        console.log(orderDetails.user);
        console.log(userId);

        const transactionDate = moment
          .unix(timestamp)
          .tz("America/New_York")
          .format("YYYY-MM-DD");

        console.log(transactionDate);
        let paidAt = Date.now();
        const data = {
          paymentId: paymentId,
          orderStatus: paymentStatus,
          paidAt: Date.now(),
          orderType: "barnSpace",
          barnRentalId: barnRentalId,
        };

        const updatedOrder = await orderDao.updatedOrder(orderId, data);
        console.log(updatedOrder);
        const updateRental = await barnDao.updateRentalSpace(barnRentalId);
        console.log("fdffffffffffff", updateRental);

        // const seq = await getNextSequenceValue("payment");
        // const invoice = "#INV" + seq;
        // const invoiceUrl = await productInvoice(
        //   invoice,
        //   paidAt,
        //   name,
        //   address,
        //   contact,
        //   paymentId,
        //   userId,
        //   discount,
        //   subTotal,
        //   total,
        //   discountPer,
        //   perAmount,
        //   quantity,
        //   "Online"
        // );
        // console.log(invoiceUrl);

        return res.status(200).json({
          message: "details updated successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "update fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [PAYMENT HOOK]: ", error);
      throw error;
    }
  }
}
module.exports = new PaymentHook();
