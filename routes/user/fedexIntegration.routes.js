const express = require("express");
const router = express.Router();
const log = require("../../configs/logger.config");
const { shippingRate, tracking } = require("../../utils/helpers/tracking.utils");
router
  .route("/getShippingRate")
  .post(express.json(),async (req, res) => {
    try {
          const shippingRates = await shippingRate();
          return res.status(200).json({
            message: "Shipping rates retrieved successfully",
            data: shippingRates,
          });
    
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
