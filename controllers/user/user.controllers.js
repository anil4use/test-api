const userService = require("../../services/user/user.services");
class UserController {
  async register(req, res) {
    try {
      const result = await userService.registerService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //verifyToken
  async verifyToken(req, res) {
    try {
      const result = await userService.verifyTokenService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async login(req, res) {
    try {
      const result = await userService.loginService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async forgetPassword(req, res) {
    try {
      const result = await userService.forgetPasswordService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(req, res) {
    try {
      const result = await userService.verifyOtpService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //reSendOtp
  async reSendOtp(req, res) {
    try {
      const result = await userService.reSendOtpService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async setNewPassword(req, res) {
    try {
      const result = await userService.setNewPasswordService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //editProfile
  async editProfile(req, res) {
    try {
      const result = await userService.editProfileService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getUserDetail
  async getUserDetail(req, res) {
    try {
      const result = await userService.getUserDetailService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //google
  async socialLogin(req, res) {
    try {
      const result = await userService.socialLoginService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async horseProfile(req, res) {
    try {
      const result = await userService.horseProfileService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //horseProfileUpdate
  async horseProfileUpdate(req, res) {
    try {
      const result = await userService.horseProfileUpdateService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //deleteHorse
  async deleteHorse(req, res) {
    try {
      const result = await userService.horseDeleteService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getHorseById
  async getHorseById(req, res) {
    try {
      const result = await userService.getHorseByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getAllHorseOfUser

  async getAllHorseOfUser(req, res) {
    try {
      const result = await userService.getAllHorseOfUserService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new UserController();
