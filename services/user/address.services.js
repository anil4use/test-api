const log = require("../../configs/logger.config");
const addressDao = require("../../daos/address.dao");
const {
  validateUSAMobileNumber,
  validateEmail,
  titleCase,
} = require("../../utils/helpers/validator.utils");
class AddressService {
  async addAddressService(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        contact,
        zipCode,
        street,
        state,
        city,
        stateOrProvinceCode,
        country,
      } = req.body;
      const userId = req.userId;


      console.log("dsfffffffff",req.body,userId);
      if (
        !userId ||
        !firstName ||
        !lastName ||
        !email ||
        !contact ||
        !zipCode ||
        !street ||
        !state ||
        !stateOrProvinceCode ||
        !city ||
        !country
      ) {
        log.error("Error from [ADDRESS SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      if (!validateUSAMobileNumber(contact)) {
        return res.status(201).json({
          message: "please enter valid phoneNumber",
          code: 201,
          status: "fail",
        });
      }

      if (!validateEmail(email)) {
        return res.status(201).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }

      const data = {
        firstName: titleCase(firstName),
        lastName: titleCase(lastName),
        email: email.toLowerCase(),
        contact,
        zipCode,
        street: titleCase(street),
        state: titleCase(state),
        city: titleCase(city),
        country: titleCase(country),
        stateOrProvinceCode,
        userId,
      };
      const result = await addressDao.addAddress(data);
      if (result.data) {
        return res.status(200).json({
          message: "address added successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "address register fail",
          status: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [ADDRESS SERVICE]: ", error);
      throw error;
    }
  }
  //updateAddressByAddressIdService
  async updateAddressByAddressIdService(req, res) {
    try {
      const {
        addressId,
        firstName,
        lastName,
        email,
        contact,
        zipCode,
        street,
        state,
        city,
        country,
        stateOrProvinceCode,
      } = req.body;
      const userId = req.userId;
      if (
        !addressId ||
        !userId ||
        !firstName ||
        !lastName ||
        !email ||
        !contact ||
        !zipCode ||
        !street ||
        !state ||
        !stateOrProvinceCode ||
        !city ||
        !country
      ) {
        log.error("Error from [ADDRESS SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      if (!validateUSAMobileNumber(contact)) {
        return res.status(201).json({
          message: "please enter valid phoneNumber",
          code: 201,
          status: "fail",
        });
      }

      if (!validateEmail(email)) {
        return res.status(201).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }

      console.log(addressId);
      const isExistAddress = await addressDao.getAddressById(addressId, userId);
      console.log(isExistAddress.data);
      if (!isExistAddress.data) {
        return res.status(201).json({
          message: "address not exist",
          code: 201,
          status: "fail",
        });
      }
      const data = {
        firstName: titleCase(firstName),
        lastName: titleCase(lastName),
        email: email.toLowerCase(),
        contact,
        zipCode,
        street: titleCase(street),
        state: titleCase(state),
        city: titleCase(city),
        country: titleCase(country),
        stateOrProvinceCode,
        userId,
      };

      const result = await addressDao.updateAddressByAddressId(addressId, data);
      if (result.data) {
        return res.status(200).json({
          message: "address updated successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "address update fail",
          status: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [ADDRESS SERVICE]: ", error);
      throw error;
    }
  }
  //deleteAddressByAddressIdService
  async deleteAddressByAddressIdService(req, res) {
    try {
      const { addressId } = req.body;
      const userId = req.userId;
      if (!addressId || !userId) {
        log.error("Error from [ADDRESS SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isExistAddress = await addressDao.getAddressById(addressId, userId);
      if (!isExistAddress.data) {
        return res.status(201).json({
          message: "address not exist",
          code: 201,
          status: "fail",
        });
      }

      const result = await addressDao.deleteAddressByAddressId(addressId);
      if (result.data) {
        return res.status(200).json({
          message: "address deleted successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "address delete fail",
          status: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [ADDRESS SERVICE]: ", error);
      throw error;
    }
  }
  //getAddressByAddressIdService
  async getAddressByAddressIdService(req, res) {
    try {
      const { addressId } = req.body;
      const userId = req.userId;
      if (!addressId || !userId) {
        log.error("Error from [ADDRESS SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isExistAddress = await addressDao.getAddressById(addressId, userId);
      if (!isExistAddress.data) {
        return res.status(201).json({
          message: "address not exist",
          code: 201,
          status: "fail",
        });
      }
      if (isExistAddress.data) {
        return res.status(200).json({
          message: "address get successfully",
          status: "success",
          data: isExistAddress.data,
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "address delete fail",
          status: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [ADDRESS SERVICE]: ", error);
      throw error;
    }
  }
  //getAllAddressOfLoginUserService
  async getAllAddressOfLoginUserService(req, res) {
    try {
      const userId = req.userId;
      console.log("dfsf");
      if (!userId) {
        log.error("Error from [ADDRESS SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await addressDao.getAllAddressByUserId(userId);
      if (result.data) {
        return res.status(200).json({
          message: "address get successfully",
          status: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "address get fail",
          status: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [ADDRESS SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new AddressService();
