const log = require("../../configs/logger.config");
const adminDao = require("../../daos/admin.dao");
const contactUsDao = require("../../daos/contactUs.dao");
const userDao = require("../../daos/user.dao");
const { removeNullUndefined } = require("../../utils/helpers/common.utils");
const {
  validateEmail,
  validateUSAMobileNumber,
} = require("../../utils/helpers/validator.utils");
class UserService {
  async createUserService(req, res) {
    try {
      const adminId = req.userId;
      const {
        firstName,
        lastName,
        contact,
        email,
        type,
        businessName,
        businessAddress,
        homeAddress,
      } = req.body;
      console.log(req.body);
      if (
        !adminId ||
        !firstName||
        !lastName||
        !contact ||
        !email ||
        !type ||
        !businessName ||
        !businessAddress ||
        !homeAddress
      ) {
        log.error("Error from [USER SERVICES]: invalid Request");
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

      const isContactExist = await userDao.getUserByContact(contact);
      if (isContactExist.data) {
        log.info("contact already exist");
        return res.status(201).json({
          message: "contact already exist",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const isEmailExist = await userDao.getUserByEmail(email);
      if (isEmailExist.data) {
        log.info("email already exist");
        return res.status(201).json({
          message: "email already exist",
          success: "fail",
          code: 201,
          data: null,
        });
      }
             console.log(req.body);
      const data = {
        firstName,
        lastName,
        contact,
        email,
        type,
        businessName,
        businessAddress,
        homeAddress,
      };
       console.log(data);
      const result = await userDao.createUser(data);
      if (result.data) {
        return res.status(200).json({
          message: "user created successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(20).json({
          message: "user created successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  //
  async updateUserService(req, res) {
    try {
      const adminId = req.userId;
      const {
        userId,
        firstName,
        lastName,
        contact,
        email,
        type,
        businessName,
        businessAddress,
        homeAddress,
        isActive
      } = req.body;
      if (
        !adminId ||
        !userId 
      ) {
        log.error("Error from [USER SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }
     
      if(email){
      if (!validateEmail(email)) {
        return res.status(201).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }
    }
        
    if(contact){
      if (!validateUSAMobileNumber(contact)) {
        return res.status(201).json({
          message: "please enter valid number",
          status: "fail",
          code: 201,
        });
      }
    }
      
      const isExist = await userDao.getUserById(userId);
      console.log(isExist.data);
      if (!isExist.data) {
        return res.status(201).json({
          message: "admin not found",
          status: "fail",
          code: 201,
        });
      }

      const data = {
        userId,
        firstName,
        lastName,
        contact,
        type,
        businessName,
        businessAddress,
        homeAddress,
        isActive
      };
      const updatedData = removeNullUndefined(data);
      const result = await userDao.updateUser(updatedData);
      if (result.data) {
        return res.status(200).json({
          message: "user update successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(20).json({
          message: "user updation  fail",
          success: "fail",
          code: 200,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICE]: ", error);
      throw error;
    }
  }
  //
  async deleteUserService(req, res) {
    try {
      const adminId = req.userId;
      const {userId} = req.body;
      if (!adminId || !userId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      console.log(userId);
      const isExist = await userDao.getUserById(userId);
      console.log(isExist);
      if (!isExist){
        return res.status(200).json({
          message: "user not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await userDao.deleteUserById(userId);
      if (result.data){
        return res.status(200).json({
          message: "user deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(404).json({
          message: "error while deleting user",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICE]: ", error);
      throw error;
    }
  }
  //
  async getAllUserService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId) {
        return res.status(400).json({
          message: "admin not given",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await adminDao.getAllUser();
      if (result) {
        return res.status(200).json({
          message: "user retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "user not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }
  //
  async getUserByIdService(req, res) {
    try {
      const adminId = req.userId;
      const {userId} = req.body;
      if (!adminId || !userId){
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await userDao.getUserById(userId);
      if (result.data){
        return res.status(200).json({
          message: "user retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "user not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }
  //getContactUsService
  async getContactUsService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId){
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await contactUsDao.getContactUsDetails();
      if (result){
        return res.status(200).json({
          message: "contact us detail get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "contact us detail not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }
  //deleteEnquiryByIdService
  async deleteEnquiryByIdService(req, res) {
    try {
      const adminId = req.userId;
      const {enquiryId}=req.body;
      if (!adminId || !enquiryId){
        return res.status(400).json({
          message: "something went wrong",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const isExist = await contactUsDao.getEnquiryById(enquiryId);
      if(!isExist.data){
        return res.status(400).json({
          message: "enquiry not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await contactUsDao.deleteContactUsById(enquiryId)
      if (result.data){
        return res.status(200).json({
          message: "enquiry deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(404).json({
          message: "enquiry deletion fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new UserService();
