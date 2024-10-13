const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const dashboardControllers = require("../../controllers/admin/dashboard.controllers");
const log = require("../../configs/logger.config");

//read
router.route("/dashboard").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await dashboardControllers.dashboard(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});

module.exports=router