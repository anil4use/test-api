const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const serviceCategoryControllers = require("../../controllers/admin/serviceCategory.Controllers");
const log = require("../../configs/logger.config");
const { uploadServiceCategoryImage } = require("../../utils/helpers/files.helper");

//create
router
  .route("/addServiceCategory")
  .post(express.json(),JWT.authenticateJWT,uploadServiceCategoryImage.single("image"), async (req, res) => {
    try {
      const result = await serviceCategoryControllers.addServiceCategory(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
//read
router
  .route("/getAllServiceCategory")
  .post(express.json(),JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await serviceCategoryControllers.getAllServiceCategory(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
//read
router
  .route("/getServiceCategoryById")
  .post(express.json(),JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await serviceCategoryControllers.getServiceCategoryById(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
//update
router
  .route("/updateServiceCategoryById")
  .post(express.json(),JWT.authenticateJWT,uploadServiceCategoryImage.single("image"), async (req, res) => {
    try {
      const result = await serviceCategoryControllers.updateServiceCategoryById(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
//delete
router
  .route("/deleteServiceCategoryById")
  .post(express.json(),JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await serviceCategoryControllers.deleteServiceCategoryById(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
