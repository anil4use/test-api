const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const eventControllers = require("../../controllers/admin/event.controllers");
const log = require("../../configs/logger.config");

//read
router.route("/addEvent").post(express.json(),JWT.authenticateJWT,
async (req, res) => {
  try {
    const result = await eventControllers.createEvent(req, res);
    return result;
  } catch (error){
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } 
});
router.route("/getAllEvent").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await eventControllers.getAllEvent(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/getEventById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await eventControllers.getEventById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });

  router.route("/updateEventById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await eventControllers.updateEventById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });
  router.route("/deleteEventById").post(express.json(),JWT.authenticateJWT,async (req, res) => {
    try {
      const result = await eventControllers.deleteEvent(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } 
  });


module.exports=router