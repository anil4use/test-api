const log = require("../configs/logger.config");
const staffModel = require("../models/staff/staff.model");
const userModel = require("../models/user.model");
const { removeNullUndefined } = require("../utils/helpers/common.utils");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
const roleDao = require("./role.dao");
const userDao = require("./user.dao");

class adminDao {
  async getStaffByContact(contact) {
    try {
      const result = await staffModel.findOne({ contact });
      if (result) {
        return {
          message: "staff found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "staff not found",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }
  async getById(adminId) {
    try {
      const result = await staffModel
        .findOne({ staffId: adminId }, { password: 0 })
        .lean();
      let role = null;
      if (result && result.roleId) {
        const role = await roleDao.getRoleById(result.roleId);
        result.role = role;
      }
      if (result) {
        return {
          message: "admin found successfully",
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
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }

  async createAdmin(data, userId) {
    try {
      const adminId = "Admin_" + (await getNextSequenceValue("admin"));
      data.staffId = adminId;
      const admin = new staffModel(data);
      const result = await admin.save();
      log.info("admin saved");
      if (result) {
        return {
          message: "admin created successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [ADMIN DAO] : admin creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }

  //find by email
  async findByEmail(email) {
    try {
      const result = await staffModel.findOne(
        { email: email },
        { password: 0 }
      );

      console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbb", result);
      if (result) {
        return {
          message: "staff get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }
  ///get email for barn
  async findByEmail(email) {
    try {
      const result = await staffModel.findOne({ email: email }, { hash: 0 });
      if (result) {
        return {
          message: "staff get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }
  //getAllUser
  async getAllUser() {
    try {
      const userInfo = await userModel.find().sort({ _id: -1 });
      console.log(userInfo.lastName);

      if (userInfo.lastName === undefined) {
        removeNullUndefined(userInfo.lastName);
      }
      let result = userInfo.map((user) => ({
        _id: user._id,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contact: user.contact,
        type: user.type,
        isActive: user.isActive,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        homeAddress: user.homeAddress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      if (result) {
        return {
          message: "users retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "users not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }
  //getAllAdmins
  async getAllAdmins(adminId, page, limit, status) {
    try {
      let filter = {
        staffId: { $ne: adminId },
        type: "admin",
      };

      if (status !== undefined) {
        filter.status = status;
      }

      const skip = (page - 1) * limit;

      const staffId = adminId;
      const result = await staffModel
        .find(filter)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "staffId name email contact status type isActive adminType businessName businessAddress homeAddress bank"
        );
      let dataWithSeqNumbers;
      if (result) {
        log.info("admins retrieved successfully");
        if (result.length > 0) {
          dataWithSeqNumbers = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
          }));
        }

        console.log(dataWithSeqNumbers);
        if (!dataWithSeqNumbers) {
          dataWithSeqNumbers = [];
        }
        console.log(dataWithSeqNumbers);
        return {
          message: "admins retrieved successfully",
          success: "success",
          code: 200,
          data: dataWithSeqNumbers,
        };
      } else {
        return {
          message: "admins not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }
  //paginateGetAllAdmins
  async paginateGetAllAdmins(adminId, page, limit) {
    try {
      const staffId = adminId;
      const currentPage = page || 1;
      const skip = (currentPage - 1) * limit;

      const result = await staffModel
        .find({
          staffId: { $ne: staffId },
        })
        .skip(skip)
        .limit(limit)
        .select("name email contact status");
      const totalAdmin = (await staffModel.countDocuments()) - 1;

      let dataWithSeqNumbers;
      if (result) {
        if (result.length > 0) {
          dataWithSeqNumbers = result.map((entry, index) => ({
            seqNumber: index + 1,
            ...entry.toObject(),
          }));
        }
        const result1 = {
          data: dataWithSeqNumbers,
          totalAdmin,
        };
        return {
          message: "admins retrieved successfully",
          success: "success",
          code: 200,
          data: result1,
        };
      } else {
        return {
          message: "admins not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }

  //updateAdminById
  async updateAdmin(adminId, data) {
    try {
      console.log("updateAdmin",data);
      console.log(adminId, data);
      const result = await staffModel.findOneAndUpdate(
        {
          staffId: adminId,
        },
        data,
        {
          new: true,
        }
      );
      console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",result);
      if (result) {
        return {
          message: "admin update successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "admin update failed",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }
  //deleteAdminById
  async deleteAdminById(adminId) {
    try {
      console.log(adminId);
      const result = await staffModel.findOneAndDelete({
        staffId: adminId,
      });
      console.log(result);
      if (result) {
        return {
          message: "admin delete successfully",
          success: "success",
          code: 200,
        };
      } else {
        return {
          message: "admin delete failed",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }

  //getRole
  // path: "categoryId",
  // localField: "categoryId",
  // foreignField: "categoryId",
  // select: "name categoryId",
  async getRole(adminId) {
    try {
      const result = await staffModel
        .findOne({
          staffId: adminId,
        })
        .populate({
          path: "roleId",
          localField: "roleId",
          foreignField: "roleId",
        })
        .select("roleId name permission");
      console.log(result);
      if (result) {
        return {
          message: "role get successfully",
          status: "success",
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
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }

  //getSuperAdmin
  async getSuperAdmin() {
    try {
      const result = await staffModel.findOne({
        staffId: "SUADMIN_1",
      });
      console.log(result);
      if (result) {
        return {
          message: "superAdmin get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "super admin not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }

  //getVendorStripeAccountId
  async getVendorStripeAccountId(vendorId) {
    try {
      const result = await staffModel
        .findOne({ staffId: vendorId })
        .select("stripeAccountId");
      console.log(result);
      if (result) {
        return {
          message: "stripe account get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "stripe account not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADMIN DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new adminDao();
