const express = require("express");
const router= express.Router();
const log = require("../../configs/logger.config");
const JWT = require("../../middleware/auth.middleware");

const rentalProduct=require("../../controllers/user/rentalProduct.controllers");

router.route("/rentalProduct").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await rentalProduct.productOnRent(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.route("/rentalOrderSummary").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await rentalProduct.rentalOrderSummary(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router.route("/deleteRentalProduct").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await rentalProduct.deleteRentalProduct(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
module.exports=router;