const log = require("../configs/logger.config");
const chatModel = require("../models/chat/chat.model");

class ChatDao {
  async createChatMessage(data) {
    try {
      const chatInfo = new chatModel(data);
      const result = await chatInfo.save();
      if (result) {
        return {
          message: "chat saved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [CHAT DAO] : cart creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [CHAT DAO] : ", error);
      throw error;
    }
  }
  //getChatHistory
  async getChatHistory(senderId,receiverId) {
    try {
      const result = await chatModel.find({
        $or: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      });
      if (result) {
        return {
          message: "chat saved successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [CHAT DAO] : cart creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [CHAT DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new ChatDao();
