const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const log = require("../../configs/logger.config");
const eventController = require("../../controllers/user/event.controllers");
router
  .route("/bookEvent")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await eventController.bookEvent(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router
  .route("/getAllBookedEvent")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await eventController.getAllBookedEvent(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });




  // router.route("/google/redirect")
  // .post(express.json(), JWT.authkey, async (req, res) => {
  //   try {
  //     const result = await eventController.redirect(req, res);
  //     return result;
  //   } catch (error) {
  //     log.error("Internal Server Error : ", error);
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });

  // router.route("/scheduleEvent")
  // .post(express.json(), JWT.authkey, async (req, res) => {
  //   try {
  //     const result = await eventController.scheduleEvent(req, res);
  //     return result;
  //   } catch (error) {
  //     log.error("Internal Server Error : ", error);
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  // });

module.exports = router;
