const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const log = require("../../configs/logger.config");
const subscriptionController = require("../../controllers/user/subscription.controllers");
router
  .route("/getAllSubscription")
  .post(express.json(), express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await subscriptionController.getAllSubscription(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router
  .route("/purchaseSubscriptionPlan")
  .post(express.json(), express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await subscriptionController.purchaseSubPlan(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
module.exports = router;
