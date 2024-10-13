const log = require("../../configs/logger.config");
const adminDao = require("../../daos/admin.dao");
const { createToken } = require("../../utils/helpers/token.utils");
const { hashItem, compareItems } = require("../../utils/helpers/bcrypt.utils");
const {
  validateEmail,
  validateUSAMobileNumber,
} = require("../../utils/helpers/validator.utils");
const staffDao = require("../../daos/staff.dao");
const userDao = require("../../daos/user.dao");
const {
  titleCase,
  removeNullUndefined,
} = require("../../utils/helpers/common.utils");
const { sanitizedUserData } = require("../../utils/helpers/sanitize.util");
const barnDao = require("../../daos/barn.dao");

class AuthService {
  async registerService(req, res) {
    try {
      const { name, contact, email, password, vandorName, type } = req.body;

      if (!name || !contact || !email || !password || !vandorName || !type) {
        log.error("Error from [AUTH SERVICES]: invalid Request");
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

      if (!validateUSAMobileNumber(contact)) {
        return res.status(201).json({
          message: "please enter valid number",
          status: "fail",
          code: 201,
        });
      }

      const isExist = await adminDao.getStaffByContact(contact);
      if (isExist.data) {
        const token = createToken(isExist.data.staffId, "Vendor");
        return res.status(200).json({
          message: "user created successfully",
          status: "success",
          code: 200,
          data: {
            staffId: userExist.data.staffId,
            contact: userExist.data.contact,
          },
          token: token,
        });
      } else {
        const data = {
          name: name,
          contact: contact,
          email: email,
          password: await hashItem(password),
        };

        const staff = await adminDao.createVendor(data);
        console.log(staff);
        const token = createToken(staff.data.staffId, "vendor");
        return res.status(200).json({
          status: "success",
          code: 200,
          message: "user created successfully",
          data: {
            userId: staff.data.staffId,
            contact: staff.data.contact,
          },
          token: token,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  async getUserById(req, res) {
    try {
      const { userId } = req.body;
      const cacheKey = `user:${userId}`;
      let user = await getAsync(cacheKey);

      if (user) {
        return res.status(200).json({
          message: "user found successfully",
          status: "success",
          code: 200,
          data: JSON.parse(user),
        });
      }

      const result = await userDao.findUserById(userId);

      if (result) {
        await setAsync(cacheKey, JSON.stringify(result));

        return res.status(200).json({
          message: "user  found successfully",
          status: "success",
          code: 200,
          data: result,
        });
      } else {
        return res.status(200).json({
          message: "user not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  //loginAdmin
  async loginService(req, res) {
    try {
      const { email, password } = req.body;

      if (email && password) {
        if (!validateEmail(email)) {
          return res.status(201).json({
            message: "please enter valid email",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        const staffExist = await adminDao.findByEmail(email);

        if (staffExist.data) {
          
          const response = await compareItems(
            password,
            staffExist.data.password
          );
 
          if (!staffExist.data.parentId) {
            if (!staffExist.data.adminType) {
              return res.status(201).json({
                message: "complete your profile first to continue",
                success: "fail",
                code: 201,
                data: null,
              });
            }
          }

          if (response) {
            let token = await createToken(staffExist.data.staffId, "Admin");
            const isExistRole = await adminDao.getRole(staffExist.data.staffId);

            return res.status(200).json({
              message: "login successfully",
              success: "success",
              code: 200,
              data: await sanitizedUserData(staffExist.data),
              token,
              role: isExistRole?.data?.roleId || "no role found",
            });
          } else {
            return res.status(201).json({
              message: "incorrect password",
              success: "fail",
              code: 201,
              data: null,
            });
          }
        } else {
          const isUserExist = await userDao.getUserByEmail(email);
          if (!isUserExist.data) {
            return res.status(201).json({
              message: "not found",
              success: "fail",
              code: 201,
              data: null,
            });
          }

          let firstName = isUserExist.data.firstName;
          let lastName = isUserExist.data.lastName;
          let contact = isUserExist.data?.contact;

          firstName = titleCase(firstName);
          lastName = titleCase(lastName);

          const data = {
            name: `${firstName} ${lastName}`,
            contact,
            type: "admin",
            email,
            password: await hashItem(password),
          };

          const newAdmin = await adminDao.createAdmin(data);
          if (newAdmin.data) {
            let token = await createToken(newAdmin.data.staffId, "Admin");
            const isExistRole = await adminDao.getRole(newAdmin.data.staffId);

            return res.status(200).json({
              message: "login successfully",
              success: "success",
              code: 200,
              data: await sanitizedUserData(newAdmin.data),
              token,
              role: isExistRole?.data?.roleId,
            });
          }
        }
      } else {
        return res.status(201).json({
          message: "email or password not enter",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  //updatePasswordService
  async updatePasswordService(req, res) {
    try {
      const adminId = req.userId;
      const { currentPassword, newPassword } = req.body;
      console.log(adminId, currentPassword, newPassword);

      if (!adminId || !currentPassword || !newPassword) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
        });
      }
      const staffId = adminId;

      const isExist = await staffDao.getStaffById(staffId);
      if (!isExist.data) {
        return res.status(404).json({
          message: "staff not found",
          success: "fail",
          code: 201,
        });
      }

      const staffExist = isExist.data;

      const isPasswordCorrect = await compareItems(
        currentPassword,
        staffExist.password
      );

       console.log("Dsfffffff",isPasswordCorrect);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Incorrect current password",
          success: "fail",
          code: 201,
        });
      }
      const updatedStaff = await staffDao.updatePassword(staffId, newPassword);
      if (updatedStaff.data) {
        return res.status(200).json({
          message: "Password updated successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "Failed to update password",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  //editProfileService
  async editProfileService(req, res) {
    try {
      const {
        name,
        email,
        phoneNumber,
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
        barnId,
        type,
      } = req.body;
      const adminId = req.userId;
      if (!adminId) {
        log.error("Error from [Admin SERVICE]: All Fields Are Mandatory");
        return res.status(400).json({
          message: "something went wrong",
          code: 201,
          status: "fail",
        });
      }

      if (phoneNumber) {
        if (!validateUSAMobileNumber(phoneNumber)) {
          return res.status(400).json({
            message: "please enter valid phoneNumber",
            status: "fail",
            code: 201,
          });
        }
      }

      const result = await adminDao.getById(adminId);
      if (!result.data) {
        return res.status(400).json({
          message: "user not found",
          success: "fail",
          code: 201,
        });
      }

      // if (currentPassword) {
      //   console.log(currentPassword, result?.data?.password);
      //   const ans = await compareItems(currentPassword, result?.data?.password);
      //   if (!ans) {
      //     return res.status(201).json({
      //       message: "please enter valid current password",
      //       success: "fail",
      //       code: 201,
      //     });
      //   }

      //   if (newPassword !== confirmNewPassword) {
      //     log.error(
      //       "Error from [User SERVICE]: new password or confirm Password not match"
      //     );
      //     return res.status(400).json({
      //       message: "new password or confirm Password not match",
      //       code: 201,
      //       status: "fail",
      //     });
      //   }
      // }

      if (type === "BarnOwner" || type === "serviceProvider") {
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

      if (barnId) {
        const isBarnExist = await barnDao.getBarnById(barnId);
        if (!isBarnExist.data) {
          return res.status(400).json({
            message: "barn not found",
            status: "failed",
            data: null,
            code: 201,
          });
        }
      }

      let adminType = null;

      if (type === "BarnOwner") {
        adminType = "BarnOwner";
      } else if (type === "serviceProvider") {
        adminType = "serviceProvider";
      } else {
        adminType = "productSeller";
      }
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
        name: name,
        contact: phoneNumber,
        email,
        type: "admin",
        state: state,
        city: city,
        zipCode,
        adminType,
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
        barnId,
      };
      const updatedData = removeNullUndefined(data);
      console.log(updatedData);
      const updatedUser = await adminDao.updateAdmin(adminId, updatedData);
      return res.status(200).json({
        message: "admin profile updated successfully",
        status: "success",
        code: 200,
        data: updatedUser.data,
      });
    } catch (error) {
      log.error("error from [Admin SERVICE]: ", error);
      throw error;
    }
  }
  //adminDetailsService
  async adminDetailsService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId) {
        log.error("Error from [Admin SERVICE]: All Fields Are Mandatory");
        return res.status(400).json({
          message: "something went wrong",
          code: 201,
          status: "fail",
        });
      }

      const result = await adminDao.getById(adminId);
      if (result.data) {
        return res.status(200).json({
          message: "staff get successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          message: "staff not found",
          status: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new AuthService();
