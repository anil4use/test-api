const log = require("../../configs/logger.config");
const adminDao = require("../../daos/admin.dao");
const { titleCase } = require("../../utils/helpers/common.utils");
const {
  validateEmail,
  validateUSAMobileNumber,
} = require("../../utils/helpers/validator.utils");
const { hashItem } = require("../../utils/helpers/bcrypt.utils");
const {
  removeNullUndefined,
  randomString,
} = require("../../utils/helpers/common.utils");
const { sendMail } = require("../../utils/helpers/email.utils");
const barnDao = require("../../daos/barn.dao");
const userDao = require("../../daos/user.dao");

class Admin {
  async addAdminService(req, res) {
    try {
      const {
        name,
        contact,
        email,
        type,
        state,
        city,
        zipCode,
        businessName,
        businessAddress,
        homeAddress,
        accountHolder,
        ACHOrWireRoutingNumber,
        accountNumber,
        bankName,
        AccountType,
        bankAddress,
        shippingAddress,
        pickupAddress,
      } = req.body;
      if (!name || !contact || !email || !type) {
        log.error("Error from [ADMIN SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      console.log("rreq", req.body);
      if (!validateEmail(email)) {
        return res.status(201).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }

      console.log("contact type", typeof contact);
      if (!validateUSAMobileNumber(contact)) {
        return res.status(201).json({
          message: "please enter valid contact number",
          status: "fail",
          code: 201,
        });
      }

      console.log("dfsssssssssssssssssssssssss");

      if (type === "barnOwner" || type === "serviceProvider") {
        if (!businessName || !businessAddress || !homeAddress) {
          log.error("Error from [ADMIN SERVICES]: invalid Request");
          return res.status(400).json({
            message: "Invalid request",
            status: "failed",
            data: null,
            code: 201,
          });
        }
      }

      if (type === "productSeller") {
        if (!shippingAddress || !pickupAddress) {
          log.error("Error from [ADMIN SERVICES]: invalid Request");
          return res.status(400).json({
            message: "Invalid request",
            status: "failed",
            data: null,
            code: 201,
          });
        }
      }

      // if (barnId) {
      //   const isBarnExist = await barnDao.getBarnById(barnId);
      //   if (!isBarnExist.data) {
      //     return res.status(400).json({
      //       message: "barn not found",
      //       status: "failed",
      //       data: null,
      //       code: 201,
      //     });
      //   }
      // }

      const isContactExist = await adminDao.getStaffByContact(contact);
      if (isContactExist.data) {
        log.info("contact already exist");
        return res.status(201).json({
          message: "contact already exist",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isEmailExist = await adminDao.findByEmail(email);
      if (isEmailExist.data) {
        log.info("email already exist");
        return res.status(201).json({
          message: "email already exist",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      let adminType = null;

      if (type === "BarnOwner") {
        adminType = "BarnOwner";
      } else if (type === "serviceProvider") {
        adminType = "serviceProvider";
      } else {
        adminType = "productSeller";
      }
      const isUserExist = await userDao.getUserByEmail(email);
      if (!isUserExist.data) {
        return res.status(201).json({
          message: "email not exist",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      // const otp = await randomString(8);

      // const emailData = {
      //   otp,
      //   email,
      // };

      // if (adminId === "SUADMIN_1") {
      //   status = "accept";
      // } else {
      //   status = "pending";
      // }

      let status = "pending";
      if (
        (accountHolder,
        ACHOrWireRoutingNumber,
        accountNumber,
        bankName,
        AccountType,
        bankAddress)
      ) {
        status = "completed";
      }

      const data = {
        name: titleCase(name),
        contact,
        email,
        type: "admin",
        state: state,
        city: city,
        zipCode,
        adminType,
        password: isUserExist?.data?.password,
        businessName,
        businessAddress,
        homeAddress,
        shippingAddress,
        pickupAddress,
        bank: {
          accountHolder,
          ACHOrWireRoutingNumber,
          accountNumber,
          bankName,
          AccountType,
          bankAddress,
        },
      };
      const result = await adminDao.createAdmin(data);
      if (result.data) {
        const data = {
          isAdmin: true,
        };
        const updatedUser = await userDao.updateUser(
          isUserExist?.data?.userId,
          data
        );

        // await sendMail({
        //   email: email,
        //   subject: "Login Using This Password",
        //   emailData,
        //   emailType: "password",
        // });

        return res.status(200).json({
          message: "admin created successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "admin creation failed",
          success: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ADD ADMIN SERVICE]: ", error);
      throw error;
    }
  }

  //get all admin

  async getAllAdminsService(req, res) {
    try {
      const adminId = req.userId;
      const { page = 1, limit = 0, status } = req.body;

      if (!adminId) {
        return res.status(201).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await adminDao.getAllAdmins(adminId, page, limit, status);
      if (result.data) {
        return res.status(200).json({
          message: "admins retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "admins not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ADD ADMIN SERVICE]: ", error);
      throw error;
    }
  }

  async getAdminByIdService(req, res) {
    try {
      const superAdminId = req.userId;
      const { adminId } = req.body;
      if (!adminId || !superAdminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await adminDao.getById(adminId);
      if (result.data) {
        return res.status(200).json({
          message: "admins retrieved successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "admins not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ADD ADMIN SERVICE]: ", error);
      throw error;
    }
  }
  async paginateGetAllAdminsService(req, res) {
    try {
      const adminId = req.userId;
      const { page, limit } = req.body;
      if (!adminId || !page || !limit) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await adminDao.paginateGetAllAdmins(adminId, page, limit);
      if (result.data) {
        return res.status(200).json({
          message: "admins retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "admins not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ADD ADMIN SERVICE]: ", error);
      throw error;
    }
  }
  async updateAdminService(req, res) {
    try {
      const superAdminId = req.userId;
      const {
        adminId,
        name,
        contact,
        email,
        state,
        city,
        type,
        zipCode,
        businessName,
        businessAddress,
        homeAddress,
        accountHolder,
        ACHOrWireRoutingNumber,
        accountNumber,
        bankName,
        AccountType,
        bankAddress,
        isActive,
      } = req.body;
      console.log(req.body);
      if (!superAdminId || !adminId) {
        log.error("Error from [ADMIN SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      if (!validateEmail(email)) {
        return res.status(201).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }

      if (contact) {
        if (!validateUSAMobileNumber(contact)) {
          return res.status(201).json({
            message: "please enter valid number",
            status: "fail",
            code: 201,
          });
        }
      }

      const isExist = await adminDao.getById(adminId);
      console.log(isExist);
      if (!isExist.data) {
        return res.status(201).json({
          message: "admin not found",
          status: "fail",
          code: 201,
        });
      }
      let status;
      if (isExist.data.status !== "completed") {
        status = isExist.data.status;
      }

      if (
        (accountHolder,
        ACHOrWireRoutingNumber,
        accountNumber,
        bankName,
        AccountType,
        bankAddress)
      ) {
        status = "completed";
      }
      const data = {
        name,
        contact,
        state,
        city,
        zipCode,
        businessName,
        businessAddress,
        homeAddress,
        bank: {
          accountHolder,
          ACHOrWireRoutingNumber,
          accountNumber,
          bankName,
          AccountType,
          bankAddress,
        },
        adminType: type,
        isActive,
        status,
      };
      console.log(data);
      const result = await adminDao.updateAdmin(adminId, data);
      console.log(result.data);
      if (result.data) {
        return res.status(200).json({
          message: "admin update successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(404).json({
          message: "admins update failed",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [ADD ADMIN SERVICE]: ", error);
      throw error;
    }
  }
  //deleteAdminByIdService
  async deleteAdminByIdService(req, res) {
    try {
      const superAdminId = req.userId;
      const { adminId } = req.body;
      console.log("adminId", adminId);
      if (!adminId || !superAdminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await adminDao.deleteAdminById(adminId);
      if (result) {
        return res.status(200).json({
          message: "admins delete successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(404).json({
          message: "admins delete not done",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [ADD ADMIN SERVICE]: ", error);
      throw error;
    }
  }

  async getAdminByIdService(req, res) {
    try {
      const superAdminId = req.userId;
      const { adminId } = req.body;
      if (!adminId || !superAdminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await adminDao.getById(adminId);
      if (result.data) {
        return res.status(200).json({
          message: "admins retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "admins not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ADD ADMIN SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new Admin();
