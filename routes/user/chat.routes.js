const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const chatController = require("../../controllers/user/chat.controllers");
const log = require("../../configs/logger.config");
const { uploadChatImages } = require("../../utils/helpers/files.helper");
router
  .route("/chatMessage")
  .post(
    express.json(),
    JWT.authkey,
    uploadChatImages.fields([{ name: "images", maxCount: 10 }]),
    async (req, res) => {
      try {
        const result = await chatController.chatMessage(req, res);
        return result;
      } catch (error) {
        log.error("Internal Server Error : ", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );


  router
  .route("/chatHistory")
  .post(
    express.json(),
    JWT.authkey,async (req, res) => {
      try {
        const result = await chatController.chatHistory(req, res);
        return result;
      } catch (error) {
        log.error("Internal Server Error : ", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );




module.exports = router;
