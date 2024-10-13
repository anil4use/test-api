const log = require("../configs/logger.config");
const roleModel = require("../models/staff/roles.model");
const { titleCase } = require("../utils/helpers/common.utils");
const getNextSequenceValue = require("../utils/helpers/counter.utils");

class RoleDao {
  async addRole(data) {
    try {
      const roleId = "BCR_" + (await getNextSequenceValue("role"));
      data.roleId = roleId;
      data.name = titleCase(data.name);
      const roleInfo = new roleModel(data);
      const result = await roleInfo.save();
      log.info("role saved");
      if (result) {
        return {
          message: "role added successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [ROLE DAO] : role creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [ROLE DAO] : ", error);
      throw error;
    }
  }
  async updateRoleById(roleId, data) {
    try {
      if(data.name){
        data.name = titleCase(data.name);
      }
      const result = await roleModel.findOneAndUpdate({ roleId }, data, {
        new: true,
      });
      log.info("role updated");
      if (result) {
        return {
          message: "role updated successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "role update fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ROLE DAO] : ", error);
      throw error;
    }
  }

  //getRoleByName
  async getRoleByName(name) {
    try {
      name = titleCase(name);
      const result = await roleModel.findOne({ name });
      console.log(result);
      if (result) {
        return {
          message: "role get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "role not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ROLE DAO] : ", error);
      throw error;
    }
  }
  //getRoleById
  async deleteRoleById(roleId) {
    try {
      const result = await roleModel.findOneAndDelete({ roleId });
      console.log(result);
      if (result) {
        return {
          message: "role deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "role deletion fail",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ROLE DAO] : ", error);
      throw error;
    }
  }
  //
  async getRoleById(roleId) {
    try {
      const result = await roleModel.findOne({ roleId });
      if (result) {
        return {
          message: "role get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "role not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ROLE DAO] : ", error);
      throw error;
    }
  }

  //getAllRole
  async getAllRole(roleId) {
    try {
      const result = await roleModel.find({}).sort({_id:-1});
      if (result) {
        return {
          message: "roles get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "roles not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ROLE DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new RoleDao();
