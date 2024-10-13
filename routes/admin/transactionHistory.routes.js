const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const transactionControllers = require("../../controllers/admin/transactionHistory.controllers");
const log = require("../../configs/logger.config");

router
  .route("/getTransactionHistory")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await transactionControllers.getTransaction(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router
  .route("/paymentHistoryForBarnRental")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await transactionControllers.paymentHistoryForBarnRental(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //

  router
  .route("/paymentHistoryForServicePurchase")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await transactionControllers.paymentHistoryForServicePurchase(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
