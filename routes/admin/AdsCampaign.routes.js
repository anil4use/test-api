const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const adsCampaignControllers = require("../../controllers/admin/adsCampaign.controllers");
const log = require("../../configs/logger.config");

//read
router.route("/addAdsCampaign").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await adsCampaignControllers.addAdsCampaign(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});

router.route("/getAllAdsCampaign").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adsCampaignControllers.getAllAdsCampaign(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/deleteAdsCampaignById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adsCampaignControllers.deleteAdsCampaign(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/updateAdsCampaignById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adsCampaignControllers.updateAdsCampaign(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });
  router.route("/getCampaignById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adsCampaignControllers.getCampaignById(req, res);
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