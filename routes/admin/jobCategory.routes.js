const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const jobCategoryControllers = require("../../controllers/admin/jobCategory.controllers");
const log = require("../../configs/logger.config");
const { uploadBarnImages } = require("../../utils/helpers/files.helper");


//read
router.route("/addJobCategory").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await jobCategoryControllers.addJobCategory(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});
router.route("/getJobCategoryById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await jobCategoryControllers.getJobCategoryById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/getAllJobCategory").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await jobCategoryControllers.getAllJobCategory(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/updateJobCategoryById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await jobCategoryControllers.updateJobCategoryById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });
  router.route("/deleteJobCategoryById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await jobCategoryControllers.deleteJobCategoryById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


module.exports=router