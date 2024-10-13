const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const adminControllers = require("../../controllers/admin/admin.controllers");
const log = require("../../configs/logger.config");

//read
router.route("/addAdmin").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await adminControllers.addAdmin(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});

router.route("/becomeMember").post(express.json(),JWT.authkey,async (req, res) => {
  try {
    const result = await adminControllers.addAdmin(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});

//updateById
router.route("/updateAdmin").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adminControllers.updateAdmin(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });
//get

router.route("/getAdminById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adminControllers.getAdminById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


  router.route("/deleteAdminById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adminControllers.deleteAdminById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


router.route("/getAllAdmins").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adminControllers.getAllAdmins(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/paginateGetAllAdmins").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adminControllers.paginateGetAllAdmins(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/paginateGetAllAdmins").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await adminControllers.paginateGetAllAdmins(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

module.exports = router;
