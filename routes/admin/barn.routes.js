const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const barnControllers = require("../../controllers/admin/barn.controllers");
const log = require("../../configs/logger.config");
const { uploadBarnImages } = require("../../utils/helpers/files.helper");


//read
router.route("/addBarn").post(express.json(),JWT.authenticateJWT,
uploadBarnImages.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
  
]),
async (req, res) => {
  try {
    const result = await barnControllers.addBarn(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});
router.route("/getAllBarn").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await barnControllers.getAllBarns(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/getBarnById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await barnControllers.getBarnById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/updateBarnById").post(express.json(),JWT.authenticateJWT,uploadBarnImages.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),async (req, res) => {
    try {
      const result = await barnControllers.updateBarn(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });
  router.route("/deleteBarnById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await barnControllers.deleteBarn(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/getHorseDetails").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await barnControllers.getHorseDetails(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


  //associateServiceProviderWithBarn
  router.route("/addServiceWithBarn").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await barnControllers.addServiceWithBarn(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  //leaveServiceFromBarn
  router.route("/leaveServiceFromBarn").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await barnControllers.leaveServiceFromBarn(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  ///all barn Associate By service
  router.route("/getAllAssociatedBarns").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await barnControllers.getAllAssociatedBarns(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  //allServiceProviderAssociateByBarn
  router.route("/allServiceProviderAssociateByBarn").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await barnControllers.allServiceProviderAssociateByBarn(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  //getAllBarnProducts
  router.route("/getAllBarnProducts").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await barnControllers.getAllBarnProducts(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


module.exports=router