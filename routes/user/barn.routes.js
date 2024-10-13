const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const BarnController = require("../../controllers/user/barn.controllers");
const log = require("../../configs/logger.config");
const { uploadHorseImages } = require("../../utils/helpers/files.helper");

router
  .route("/getAllBarn")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await BarnController.getAllBarn(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getBarnById")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await BarnController.getBarnById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/addReviewByBarnId")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await BarnController.addReviewByBarnId(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getReviewByBarnId")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await BarnController.getReviewByBarnId(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.route("/rentingSpace").post(
  express.json(),
  JWT.authenticateJWT,
  // uploadHorseImages.fields([
  //   { name: "docs", maxCount: 10 },
  //   { name: "images", maxCount: 10 },
  // ]),
  async (req, res) => {
    try {
      const result = await BarnController.rentingSpace(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);


router.route("/rentingSpaceSummary").post(
  express.json(),
  JWT.authenticateJWT,
  async (req, res) => {
    try {
      const result = await BarnController.rentingSpaceSummary(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
