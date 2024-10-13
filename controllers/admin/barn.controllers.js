const barnService = require("../../services/admin/barn.services");
class BarnController {
  async addBarn(req, res) {
    try {
      const result = await barnService.addBarnService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async getAllBarns(req, res) {
    try {
      const result = await barnService.getAllBarnService(req, res);
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
  async updateBarn(req, res) {
    try {
      const result = await barnService.updateBarnService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteBarn(req, res) {
    try {
      const result = await barnService.deleteBarnService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getHorseDetails
  async getHorseDetails(req, res) {
    try {
      const result = await barnService.getHorseDetailsService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //addServiceWithBarn
  async addServiceWithBarn(req, res) {
    try {
      const result = await barnService.addServiceWithBarnService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

    //leaveServiceFromBarn
    async leaveServiceFromBarn(req, res) {
      try {
        const result = await barnService.leaveServiceFromBarnService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
    }


  //getAllAssociatedBarns
  async getAllAssociatedBarns(req, res) {
    try {
      const result = await barnService.getAllAssociatedBarnsService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //allServiceProviderAssociateByBarn
  async allServiceProviderAssociateByBarn(req, res) {
    try {
      const result = await barnService.allServiceProviderAssociateByBarnService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getAllBarnProducts
  async getAllBarnProducts(req, res) {
    try {
      const result = await barnService.getAllBarnProductsService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
}
module.exports = new BarnController();
