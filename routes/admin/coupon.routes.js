const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const couponControllers = require("../../controllers/admin/coupon.controllers");
const log = require("../../configs/logger.config");

//read
router.route("/addCoupon").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await couponControllers.addCoupon(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});

router.route("/getAllCoupon").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await couponControllers.getAllCoupon(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/deleteCouponById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await couponControllers.deleteCoupon(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/updateCouponById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await couponControllers.updateCoupon(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });
  router.route("/getCouponById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await couponControllers.getCouponById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/assignCouponByUserId").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await couponControllers.assignCouponByUserId(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


module.exports=router