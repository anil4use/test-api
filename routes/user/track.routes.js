const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const log = require("../../configs/logger.config");
const trackController = require("../../controllers/user/track.controllers");
router
  .route("/trackOrder")
  .post(express.json(), express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await trackController.trackOrder(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
module.exports = router;
