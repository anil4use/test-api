const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const staffControllers = require("../../controllers/admin/staff.controllers");
const roleControllers=require("../../controllers/admin/role.controllers")
const log = require("../../configs/logger.config");

//read
router.route("/addStaff").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await staffControllers.addStaff(req, res);
    return result;  
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});

//updateById
router.route("/updateStaff").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await staffControllers.updateStaff(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });
//get

router.route("/deleteStaff").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await staffControllers.deleteStaff(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


  router.route("/getAllStaff").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await staffControllers.getAllStaff(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


router.route("/getStaffById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await staffControllers.getStaffById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/getStaffPermission").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await staffControllers.getStaffPermission(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


  //roles

  router.route("/addRole").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await roleControllers.addRole(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/updateRole").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await roleControllers.updateRole(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/deleteRole").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await roleControllers.deleteRole(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  //getAllRole
  router.route("/getAllRole").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await roleControllers.getAllRole(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


  router.route("/getRoleById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await roleControllers.getRoleById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

module.exports = router;
