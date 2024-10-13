const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const log = require("../../configs/logger.config");
const ReviewAndWishListController = require("../../controllers/user/reviewAndWish.controllers");
router
  .route("/addReviewByProductId")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await ReviewAndWishListController.addReviewOfProduct(
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
  .route("/getReviewByProductId")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await ReviewAndWishListController.getReviewOfProduct(
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
  .route("/addWishlistByProductId")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await ReviewAndWishListController.addWishlistByProductId(
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
  .route("/getWishlist")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await ReviewAndWishListController.getWishlist(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/removeWishlistByProductId")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result =
        await ReviewAndWishListController.removeWishlistByProductId(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//service
router
  .route("/addReviewByServiceId")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await ReviewAndWishListController.addReviewOfService(
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
  .route("/getReviewByServiceId")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await ReviewAndWishListController.getReviewOfService(
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
