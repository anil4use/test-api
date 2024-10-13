const log = require("../../configs/logger.config");
const userDao = require("../../daos/user.dao");
const chatDao = require("../../daos/chat.dao");
const {
  validateUSAMobileNumber,
  validateEmail,
  titleCase,
} = require("../../utils/helpers/validator.utils");
const { removeNullUndefined } = require("../../utils/helpers/common.utils");

class CartService {
  async chatMessageService(req, res) {
    try {
      const { senderId, receiverId, message } = req.body;
      if (!senderId || !receiverId || !message) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      let imagesArray = [];
      if (req.files.images && req.files.images.length > 0) {
        await Promise.all(
          req.files.images.map((img) => {
            imagesArray.push(img.location);
          })
        );
      }

      let data = {
        senderId: senderId,
        receiverId: receiverId,
        message: message,
        media: imagesArray,
      };
      const UpdatedData = removeNullUndefined(data);
      const result = await chatDao.createChatMessage(UpdatedData);

      if (result.data) {
        return res.status(200).json({
          message: "chat get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "chat saved fail",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [CHAT SERVICE]: ", error);
      throw error;
    }
  }
  //chatHistoryService
  async chatHistoryService(req, res) {
    try {
      const { senderId, receiverId } = req.body;
      if (!senderId || !receiverId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await chatDao.getChatHistory(senderId,receiverId);


      if (result.data) {
        return res.status(200).json({
          message: "chat get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "chat saved fail",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [CHAT SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new CartService();
