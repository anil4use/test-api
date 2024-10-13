const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const CartController = require("../../controllers/user/cart.controllers");
const log = require("../../configs/logger.config");

router.route("/addToCart").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await CartController.addToCart(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/removeProductFromCart").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await CartController.removeProductFromCart(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/getCart").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await CartController.getCart(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/applyCoupon").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await CartController.applyCoupon(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/removeAppliedCoupon").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await CartController.removeAppliedCoupon(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/orderSummary").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await CartController.orderSummary(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/resetCart").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await CartController.resetCart(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
