const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const authControllers = require("../../controllers/admin/auth.controllers");
const log = require("../../configs/logger.config");

router.route("/login").post(express.json(), JWT.authkey, async (req, res) => {
  try {
    const result = await authControllers.login(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router
  .route("/updatePassword")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await authControllers.updatePassword(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/editProfile")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await authControllers.editProfile(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/adminDetails")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await authControllers.adminDetails(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
