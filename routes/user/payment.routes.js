const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const PaymentController = require("../../controllers/user/payment.controllers");
const log = require("../../configs/logger.config");

router
  .route("/webHook")
  .post(express.raw({ type: "application/json" }),async (req, res) => {
    try {
      const result = await PaymentController.productWebHook(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  
  router
  .route("/rentalProductWebHook")
  .post(express.raw({ type: "application/json" }),async (req, res) => {
    try {
      const result = await PaymentController.rentalProductWebHook(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router
  .route("/subscriptionPaymentWebHook")
  .post(express.raw({ type: "application/json" }),async (req, res) => {
    try {
      const result = await PaymentController.subscriptionWebHook(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router
  .route("/servicePaymentWebHook")
  .post(express.raw({ type: "application/json" }),async (req, res) => {
    try {
      const result = await PaymentController.servicePaymentWebHook(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //rentalSpacePaymentWebHook
  router
  .route("/rentalSpacePaymentWebHook")
  .post(express.raw({ type: "application/json" }),async (req, res) => {
    try {
      const result = await PaymentController.rentalSpacePaymentWebHook(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
