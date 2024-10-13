const express = require("express");
const router= express.Router();
const log = require("../../configs/logger.config");
const JWT = require("../../middleware/auth.middleware");

const OrderController=require("../../controllers/user/order.controllers");
router.route("/createOrder").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await OrderController.createOrder(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.route("/getOrderHistory").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await OrderController.getOrderHistory(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports=router;