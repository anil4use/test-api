const express = require("express");
const router = express.Router();
const JWT = require("../../../middleware/auth.middleware");
const subCategoryControllers = require("../../../controllers/admin/product/subCategory.controllers");
const log = require("../../../configs/logger.config");
const {
  uploadSubCategoryImage,
} = require("../../../utils/helpers/files.helper");

router
  .route("/addSubCategory")
  .post(
    JWT.authenticateJWT,
    uploadSubCategoryImage.single("image"),
    async (req, res) => {
      try {
        const result = await subCategoryControllers.addSubCategory(req, res);
        return result;
      } catch (error) {
        log.error("Internal Server Error : ", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

router
  .route("/updateSubCategoryById")
  .post(
    JWT.authenticateJWT,
    uploadSubCategoryImage.single("image"),
    async (req, res) => {
      try {
        const result = await subCategoryControllers.updateSubCategoryById(
          req,
          res
        );
        return result;
      } catch (error) {
        log.error("Internal Server Error : ", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

router
  .route("/deleteSubCategoryById")
  .post(JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await subCategoryControllers.deleteSubCategoryById(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getSubCategoryById")
  .post(JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await subCategoryControllers.getSubCategoryById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getSubCategoriesForCategoryId")
  .post(JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await subCategoryControllers.getSubCategoriesForCategoryId(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getAllSubCategory")
  .post(JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await subCategoryControllers.getAllSubCategory(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


  
router
.route("/updateNewSubCategoryRequest")
.post(JWT.authenticateJWT, async (req, res) => {
  try {
    const result = await subCategoryControllers.updateNewSubCategoryRequest(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
