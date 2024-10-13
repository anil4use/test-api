const express = require("express");
const router = express.Router();
const JWT = require("../../../middleware/auth.middleware");
const categoryControllers = require("../../../controllers/admin/product/category.controllers");
const log = require("../../../configs/logger.config");
const { uploadCategoryImage } = require("../../../utils/helpers/files.helper");

router
  .route("/addCategory")
  .post(
    JWT.authenticateJWT,
    uploadCategoryImage.single("image"),
    async (req, res) => {
      try {
        const result = await categoryControllers.addCategory(req, res);
        return result;
      } catch (error) {
        log.error("Internal Server Error : ", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

router
  .route("/updateCategoryById")
  .post(
    JWT.authenticateJWT,
    uploadCategoryImage.single("image"),
    async (req, res) => {
      try {
        const result = await categoryControllers.updateCategoryById(req, res);
        return result;
      } catch (error) {
        log.error("Internal Server Error : ", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

router
  .route("/deleteCategoryById")
  .post(JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await categoryControllers.deleteCategoryById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.route("/getCategoryById").post(JWT.authenticateJWT, async (req, res) => {
  try {
    const result = await categoryControllers.getCategoryById(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/getAllCategory").post(JWT.authenticateJWT, async (req, res) => {
  try {
    const result = await categoryControllers.getAllCategory(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router
  .route("/updateNewCategoryRequest")
  .post(JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await categoryControllers.updateNewCategoryRequest(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
module.exports = router;
