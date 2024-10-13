const userService = require("../../services/admin/user.services");
class UserController {
  async createUser(req, res) {
    try {
      const result = await userService.createUserService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateUser(req, res) {
    try {
      const result = await userService.updateUserService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteUser(req, res) {
    try {
      const result = await userService.deleteUserService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAllUser(req, res){
    try {
      const result = await userService.getAllUserService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getUserById(req, res){
    try {
      const result = await userService.getUserByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getContactUs
  async getContactUs(req, res){
    try {
      const result = await userService.getContactUsService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //deleteEnquiryById
  async deleteEnquiryById(req, res){
    try {
      const result = await userService.deleteEnquiryByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new UserController();
