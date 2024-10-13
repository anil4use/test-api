const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const log = require("../../configs/logger.config");
const ServiceController = require("../../controllers/user/service.controllers");
router
  .route("/getAllService")
  .post(express.json(), express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await ServiceController.getAllService(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getServiceByServiceId")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await ServiceController.getServiceByServiceId(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/serviceEnquiry")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await ServiceController.serviceEnquiry(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getAllServiceCategory")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await ServiceController.getAllServiceCategory(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//createServiceOrder
router
  .route("/servicePurchase")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await ServiceController.createServiceOrder(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router
  .route("/servicePurchaseSummary")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await ServiceController.servicePurchaseSummary(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router
  .route("/deleteServicePurchaseSummary")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await ServiceController.deleteServicePurchaseSummary(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
//getServiceOrderHistory
router
  .route("/getServiceOrderHistory")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await ServiceController.getServiceOrderHistory(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
module.exports = router;
