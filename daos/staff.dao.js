const getNextSequenceValue = require("../utils/helpers/counter.utils");
const log = require("../configs/logger.config");
const { titleCase } = require("../utils/helpers/common.utils");
const staffModel = require("../models/staff/staff.model");
const { hashItem } = require("../utils/helpers/bcrypt.utils");

class StaffDao {
  //getStaffByEmail
  async getStaffByEmail(email) {
    try {
      const result = await staffModel.findOne({ email });
      if (result) {
        return {
          message: "staff found successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
  //byContact
  async getStaffByContact(contact) {
    try {
      const result = await staffModel.findOne({ contact });
      if (result) {
        return {
          message: "staff found successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
  //create staff
  async createStaff(data) {
    try {
      const adminId = "EMP_" + (await getNextSequenceValue("staff"));
      data.staffId = adminId;
      data.password = await hashItem(data.password);
      data.name = titleCase(data.name);
      data.email = data.email.toLowerCase();
      const admin = new staffModel(data);
      const result = await admin.save();
      log.info("staff saved");
      if (result) {
        return {
          message: "staff created successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [STAFF DAO] : staff creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }

  //updateStaff

  async updateStaff(staffId, data) {
    try {
      const result = await staffModel.findOneAndUpdate({ staffId }, data, {
        new: true,
      });
      log.info("staff updated");
      if (result) {
        return {
          message: "staff updated successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff update fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
  //finStaffById

  async findStaffById(staffId) {
    try {
      const result = await staffModel
        .findOne({ staffId })
        .select("staffId name contact email roleId type isActive");
      log.info("staff get successfully");
      if (result) {
        return {
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }

  async deleteStaffById(staffId) {
    try {
      const result = await staffModel.findOneAndDelete({ staffId });
      log.info("staff deleted");
      if (result) {
        return {
          message: "staff deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff deletion fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
  //getAllStaff
  async getAllStaff(adminId) {
    try {
      const result = await staffModel
        .find({ parentId: adminId })
        .select("staffId name contact email roleId type isActive")
        .populate([
          {
            path: "roleId",
            model: "Role",
            localField: "roleId",
            foreignField: "roleId",
          },
        ])
        .sort({ _id: -1 });
      console.log(result);
      log.info("staff get successfully");
      if (result) {
        return {
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }

  //getStaffById
  async getStaffById(staffId) {
    try {
      const result = await staffModel.findOne({ staffId });
      log.info("staff get successfully");
      if (result) {
        return {
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
  //getStaffNotThisEmailAndId
  async getStaffNotThisEmailAndId(email, staffId) {
    try {
      const result = await staffModel.findOne({
        email: email.trim().toLowerCase(),
        staffId: { $ne: staffId },
      });
      log.info("staff get successfully");
      if (result) {
        return {
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }

  //getStaffNotThisContactAndId
  async getStaffNotThisContactAndId(contact, staffId) {
    try {
      const result = await staffModel.findOne({
        contact: contact,
        staffId: { $ne: staffId },
      });
      console.log(result);
      log.info("staff get successfully");
      if (result) {
        return {
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
  //checkForAdmin
  async checkForAdmin(adminId) {
    try {
      const result = await staffModel.findOne({
        staffId: adminId,
        type: "Admin",
      });
      log.info("admin get successfully");
      if (result) {
        return {
          message: "admin get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "admin not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
  //getStaffByIdWithPermission
  async getStaffByIdWithPermission(staffId) {
    try {
      const result = await staffModel.findOne({ staffId }).populate([
        {
          path: "roleId",
          model: "Role",
          localField: "roleId",
          foreignField: "roleId",
        },
      ]);
      log.info("staff get successfully");
      if (result) {
        return {
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }

  //updatePassword
  async updatePassword(staffId, newPassword) {
    try {
      newPassword = await hashItem(newPassword);
      const result = await staffModel.findOneAndUpdate(
        { staffId },
        { password: newPassword },
        { new: true }
      );
      log.info("password updated successfully");
      if (result) {
        return {
          message: "password updated successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "password update fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [STAFF DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new StaffDao();
