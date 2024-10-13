const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const log = require("../../configs/logger.config");
const productController = require("../../controllers/user/product.controllers");

router
  .route("/getAllProducts")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.getAllProducts(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//getAllProductBetweenMinPriceAndMaxPriceRange
router
  .route("/getAllProductsBetweenPriceRange")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.getAllProductsBetweenPriceRange(
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
  .route("/getAllProductsByCategory")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.getAllProductsByCategory(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//getProductByCategoryId
router
  .route("/getProductByCategoryId")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.getProductByCategoryId(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//getProductByProductId
router
  .route("/getProductByProductId")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.getProductByProductId(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//searchProductByKeyWord
router
  .route("/searchProductByKeyWord")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.searchProductByKeyWord(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//
router
  .route("/getSubCategoryByCategoryId")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.getSubCategoryByCategoryId(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//getSubCategoryProduct
router
  .route("/getSubCategoryProductBySubCategoryId")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result =
        await productController.getSubCategoryProductBySubCategoryId(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
//getCategoryProduct
router
  .route("/getCategoryProductByCategoryId")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.getCategoryProductByCategoryId(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//get all category and its subcategory
router
  .route("/getCategoryAndSubCategory")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.getCategoryAndSubCategory(
        req,
        res
      );
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//get All coupon

router
  .route("/getUserAllCoupon")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await productController.getUserAllCoupon(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getUserAllCoupon")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await productController.getUserAllCoupon(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//contact us

router
  .route("/contactUs")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await productController.contactUs(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
