const barnService = require("../../services/user/barn.services");
class BarnController {
  async getAllBarn(req, res) {
    try {
      const result = await barnService.getAllBarnService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getBarnById
  async getBarnById(req, res) {
    try {
      const result = await barnService.getBarnByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getBarnById(req, res) {
    try {
      const result = await barnService.getBarnByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //addReviewByBarnId
  async addReviewByBarnId(req, res) {
    try {
      const result = await barnService.addReviewByBarnIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getReviewByBarnId
  async getReviewByBarnId(req, res) {
    try {
      const result = await barnService.getReviewByBarnIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //rentingSpace
  async rentingSpace(req, res) {
    try {
      const result = await barnService.rentingSpaceService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //rentingSpaceSummary
  async rentingSpaceSummary(req, res) {
    try {
      const result = await barnService.rentingSpaceSummary(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new BarnController();
