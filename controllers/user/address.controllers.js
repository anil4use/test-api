const AddressService = require("../../services/user/address.services");
class AddressController {
  async addAddress(req, res) {
    try {
      const result = await AddressService.addAddressService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //updateAddressByAddressId
  async updateAddressByAddressId(req, res) {
    try {
      const result = await AddressService.updateAddressByAddressIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //deleteAddressByAddressId
  async deleteAddressByAddressId(req, res) {
    try {
      const result = await AddressService.deleteAddressByAddressIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getAddressByAddressId
  async getAddressByAddressId(req, res) {
    try {
      const result = await AddressService.getAddressByAddressIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  //getAllAddressOfUser
  async getAllAddressOfLoginUser(req, res) {
    try {
      const result = await AddressService.getAllAddressOfLoginUserService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new AddressController();
