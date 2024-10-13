const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const serviceControllers = require("../../controllers/admin/service.controllers");
const log = require("../../configs/logger.config");
const { uploadServiceImages } = require("../../utils/helpers/files.helper");

//create
router.route("/addService").post(
  express.json(),
  JWT.authenticateJWT,
  uploadServiceImages.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const result = await serviceControllers.addService(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
//read
router
  .route("/getAllService")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await serviceControllers.getAllServices(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
//read
router
  .route("/getServiceById")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await serviceControllers.getServiceById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
//update
router.route("/updateServiceById").post(
  express.json(),
  JWT.authenticateJWT,
  uploadServiceImages.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const result = await serviceControllers.updateService(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
//delete
router
  .route("/deleteServiceById")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await serviceControllers.deleteService(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //getServiceEnquiry
  router
  .route("/getAllServiceEnquiry")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await serviceControllers.getAllServiceEnquiry(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  //deleteServiceEnquiryById
  router
  .route("/deleteServiceEnquiryById")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await serviceControllers.deleteServiceEnquiryById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


module.exports = router;
