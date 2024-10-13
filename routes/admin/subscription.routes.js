const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const subscriptionControllers = require("../../controllers/admin/subscription.controller");
const log = require("../../configs/logger.config");

//read
router.route("/addSubscription").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await subscriptionControllers.addSubscription(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});

router.route("/getAllSubscription").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await subscriptionControllers.getAllSubscription(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/deleteSubscriptionById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await subscriptionControllers.deleteSubscription(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/updateSubscriptionById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await subscriptionControllers.updateSubscription(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });
  router.route("/getSubscriptionById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await subscriptionControllers.getSubscriptionById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });
  
module.exports=router