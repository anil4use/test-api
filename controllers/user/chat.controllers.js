const chatService = require("../../services/user/chat.services");
class ChatController {
  async chatMessage(req, res) {
    try {
      const result = await chatService.chatMessageService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //chatHistory
  async chatHistory(req, res) {
    try {
      const result = await chatService.chatHistoryService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new ChatController();
