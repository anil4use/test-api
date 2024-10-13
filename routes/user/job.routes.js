const express = require("express");
const router = express.Router();
const log = require("../../configs/logger.config");
const JWT = require("../../middleware/auth.middleware");
const jobControllers = require("../../controllers/user/job.controllers");
const { uploadApplicantResume } = require("../../utils/helpers/files.helper");

router.route("/getJobDetails").post(express.json(),JWT.authkey, async (req, res) => {
  try {
    const result = await jobControllers.getJobDetails(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/getJobById").post(express.json(),JWT.authkey, async (req, res) => {
  try {
    const result = await jobControllers.getJobById(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.route("/getAllJobCategory").post(express.json(),JWT.authkey, async (req, res) => {
  try {
    const result = await jobControllers.getAllJobCategory(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.route("/applyForJob").post(express.json(),
  JWT.authkey,
  uploadApplicantResume.fields([
    { name: "resume", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const result = await jobControllers.applyForJob(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);
module.exports = router;
