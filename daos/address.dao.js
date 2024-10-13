const getNextSequenceValue = require("../utils/helpers/counter.utils");
const log = require("../configs/logger.config");
const addressModel = require("../models/address/address.model");

class AddressDao {
  async addAddress(data) {
    try {
      const addressId = "Bill_" + (await getNextSequenceValue("address"));
      data.addressId = addressId;

      const addressInfo = new addressModel(data);
      const result = await addressInfo.save();
      log.info("address saved");
      if (result) {
        return {
          message: "address created successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [ADDRESS DAO] : address creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [ADDRESS DAO] : ", error);
      throw error;
    }
  }
  //updateAddressByAddressId(addressId,data);
  async updateAddressByAddressId(addressId, data) {
    try {
      const result = await addressModel.findOneAndUpdate(
        { addressId: addressId },
        data,
        {
          new: true,
        }
      );
      if (result) {
        return {
          message: "address update successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "address update fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADDRESS DAO] : ", error);
      throw error;
    }
  }
  //getAddressById
  async getAddressById(addressId, userId) {
    try {
      console.log(addressId,userId);
      const result = await addressModel.findOne({
        addressId: addressId,
        userId: userId,
      });
      if (result) {
        return {
          message: "address get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "address get fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADDRESS DAO] : ", error);
      throw error;
    }
  }
  //deleteAddressByAddressId
  async deleteAddressByAddressId(addressId) {
    try {
      const result = await addressModel.findOneAndDelete({
        addressId: addressId,
      });
      if (result) {
        return {
          message: "address deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "address delete fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADDRESS DAO] : ", error);
      throw error;
    }
  }
  //getAllAddressByUserId
  async getAllAddressByUserId(userId) {
    try {
      const result = await addressModel.find({ userId: userId }).sort({_id:-1});
      let seqNumber = 0;
      let newResult;
      if (result) {
        if(result.length>0){
         newResult = result.map((entry, index) => ({
          seqNumber: index + 1,
          ...entry.toObject(),
        }));
      }
        return {
          message: "address get successfully",
          status: "success",
          code: 200,
          data: (newResult = newResult === undefined ? [] : newResult),
        };
      } else {
        return {
          message: "address get fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADDRESS DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new AddressDao();
