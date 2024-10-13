const authService = require("../../services/admin/auth.services");
class AuthController {
  async register(req, res) {
    try {
      const result = await authService.registerService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //login
  async login(req, res) {
    try {
      const result = await authService.loginService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //updatePassword
  async updatePassword(req, res) {
    try {
      const result = await authService.updatePasswordService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //editProfile
  async editProfile(req, res) {
    try {
      const result = await authService.editProfileService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //adminDetails
  async adminDetails(req, res) {
    try {
      const result = await authService.adminDetailsService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

}
module.exports = new AuthController();
