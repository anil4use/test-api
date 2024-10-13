const log = require("../../configs/logger.config");
const {
  validateEmail,
  validateUSAMobileNumber,
  titleCase,
} = require("../../utils/helpers/validator.utils");
const staffDao = require("../../daos/staff.dao");
const staffModel = require("../../models/staff/staff.model");
const roleDao = require("../../daos/role.dao");
const adminDao = require("../../daos/admin.dao");
const { compareItems, hashItem } = require("../../utils/helpers/bcrypt.utils");
const { removeNullUndefined } = require("../../utils/helpers/common.utils");

class StaffService {
  async addStaffService(req, res) {
    try {
      const adminId = req.userId;
      const { name, email, contact, roleId, password } = req.body;
      console.log(req.body);
      if (!adminId || !name || !email || !contact || !roleId || !password) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      if (!validateEmail(email)) {
        return res.status(201).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }

      const isExist = await staffDao.getStaffByEmail(email);

      if (isExist.data) {
        return res.status(201).json({
          message: "email already in use",
          status: "fail",
          code: 201,
        });
      }

      if (!validateUSAMobileNumber(contact)) {
        return res.status(201).json({
          message: "please enter valid contact",
          status: "fail",
          code: 201,
        });
      }

      const isRoleExist = await roleDao.getRoleById(roleId);
      if (!isRoleExist.data) {
        return res.status(400).json({
          message: "role not found",
          status: "fail",
          code: 201,
        });
      }

      const isExistContact = await staffDao.getStaffByContact(contact);

      if (isExistContact.data) {
        return res.status(201).json({
          message: "contact already exist",
          status: "fail",
          code: 201,
        });
      }

      const data = {
        name,
        email,
        contact,
        roleId,
        password,
        type: "Employee",
        parentId: adminId,
      };

      console.log(data);
      const result = await staffDao.createStaff(data);
      if (result.data) {
        return res.status(200).json({
          message: "staff saved successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "staff creation failed",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [STAFF SERVICE]: ", error);
      throw error;
    }
  }

  //updateStaffService

  async updateStaffService(req, res) {
    try {
      const adminId = req.userId;
      const { staffId, name, email, contact, roleId, isActive } =
        req.body;

      if (!adminId || !staffId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      if (email) {
        if (!validateEmail(email)) {
          return res.status(201).json({
            message: "please enter valid email",
            code: 201,
            status: "fail",
          });
        }

        const isEmailExist = await staffDao.getStaffNotThisEmailAndId(
          email,
          staffId
        );
        if (isEmailExist.data) {
          return res.status(201).json({
            message: "email already in use",
            status: "fail",
            code: 201,
          });
        }
      }

      if (contact) {
        if (!validateUSAMobileNumber(contact)) {
          return res.status(201).json({
            message: "please enter valid contact",
            status: "fail",
            code: 201,
          });
        }
        const isContactExist = await staffDao.getStaffNotThisContactAndId(
          contact,
          staffId
        );
        if (isContactExist.data) {
          return res.status(201).json({
            message: "contact already in use",
            status: "fail",
            code: 201,
          });
        }
      }

      const staffExist = await staffDao.getStaffById(staffId);
      if (!staffExist.data) {
        return res.status(404).json({
          message: "staff not found",
          status: "fail",
          code: 201,
        });
      }

      // if (password) {
      //   const result = await compareItems(password, staffExist.data.password);

      //   if (!result) {
      //     return res.status(400).json({
      //       message: "please enter correct password",
      //       status: "fail",
      //       code: 201,
      //     });
      //   }
      // }

      const data = {
        name,
        email,
        contact,
        roleId,
        isActive,
      };

      const updatedData=await removeNullUndefined(data);
      updatedData.name=titleCase(updatedData.name);

      const result = await staffDao.updateStaff(staffId, updatedData);
      if (result.data) {
        return res.status(200).json({
          message: "staff update successfully",
          status: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "staff update fail",
          status: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [STAFF SERVICE]: ", error);
      throw error;
    }
  }

  //deleteStaffService
  async deleteStaffService(req, res) {
    try {
      const adminId = req.userId;
      const { staffId } = req.body;

      if (!adminId || !staffId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const adminExist = await staffDao.checkForAdmin(adminId);
      if (!adminExist) {
        return res.status(400).json({
          message: "admin not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const isExist = await staffDao.findStaffById(staffId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await staffDao.deleteStaffById(staffId);
      if (result.data) {
        return res.status(200).json({
          message: "staff deleted successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "staff delete fail",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [STAFF SERVICE]: ", error);
      throw error;
    }
  }
  //get staff by id
  async getStaffByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { staffId } = req.body;

      if (!adminId || !staffId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await staffDao.findStaffById(staffId);

      if (result.data) {
        return res.status(200).json({
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [STAFF SERVICE]: ", error);
      throw error;
    }
  }
  //getAllStaffService
  async getAllStaffService(req, res) {
    try {
      const adminId = req.userId;

      if (!adminId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const isExist = await adminDao.getById(adminId);
      console.log("dsahfhjdafjgj", isExist.data);
      if (!isExist.data) {
        return res.status(400).json({
          message: "admin not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await staffDao.getAllStaff(adminId);
      if (result.data) {
        return res.status(200).json({
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [STAFF SERVICE]: ", error);
      throw error;
    }
  }
  //getStaffPermissionService
  async getStaffPermissionService(req, res) {
    try {
      const adminId = req.userId;
      const { staffId } = req.body;
      if (!adminId || !staffId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const isExist = await staffDao.getStaffById(staffId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await staffDao.getStaffByIdWithPermission(staffId);
      if (result.data) {
        return res.status(200).json({
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [STAFF SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new StaffService();
