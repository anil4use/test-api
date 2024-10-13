const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const userControllers = require("../../controllers/admin/user.controllers");
const log = require("../../configs/logger.config");

router
  .route("/addUser")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await userControllers.createUser(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/updateUserById")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await userControllers.updateUser(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
router
  .route("/deleteUserById")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await userControllers.deleteUser(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getAllUser")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await userControllers.getAllUser(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getUserById")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await userControllers.getUserById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//contactUs
router
  .route("/getContactUs")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await userControllers.getContactUs(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//delete
router
  .route("/deleteEnquiryById")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await userControllers.deleteEnquiryById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
