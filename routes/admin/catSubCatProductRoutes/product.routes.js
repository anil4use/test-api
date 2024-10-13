const express = require("express");
const router = express.Router();
const JWT = require("../../../middleware/auth.middleware");
const productControllers = require("../../../controllers/admin/product/product.controllers");
const log = require("../../../configs/logger.config");
const { uploadProductImages } = require("../../../utils/helpers/files.helper");
router
  .route("/addProduct")
  .post(
    JWT.authenticateJWT,
    uploadProductImages.fields([
      { name: "image", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    async (req, res) => {
      try {
        const result = await productControllers.addProduct(req, res);
        return result;
      } catch (error) {
        log.error("Internal Server Error : ", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

router
  .route("/updateProductById")
  .post(
    JWT.authenticateJWT,
    uploadProductImages.fields([
      { name: "image", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    async (req, res) => {
      try {
        const result = await productControllers.updateProductById(req, res);
        return result;
      } catch (error) {
        log.error("Internal Server Error : ", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

router.route("/deleteProductById").post(JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await productControllers.deleteProductById(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/getProductById").post(JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await productControllers.getProductById(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/getAllProduct").post(JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await productControllers.getAllProduct(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/returnProduct").post(JWT.authenticateJWT,async (req,res)=>{
  try {
    const result = await productControllers.returnProduct(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
})

module.exports = router;
