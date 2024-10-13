const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const AddressController = require("../../controllers/user/address.controllers");
const log = require("../../configs/logger.config");

router.route("/addAddress").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await AddressController.addAddress(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.route("/updateAddressByAddressId").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await AddressController.updateAddressByAddressId(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.route("/deleteAddressByAddressId").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await AddressController.deleteAddressByAddressId(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
router.route("/getAddressByAddressId").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await AddressController.getAddressByAddressId(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//
router.route("/getAllAddressOfLoginUser").post(express.json(),JWT.authenticateJWT,async (req, res) => {
  try {
    const result = await AddressController.getAllAddressOfLoginUser(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
