const log = require("../../configs/logger.config");
const userDao = require("../../daos/user.dao");
const { createToken } = require("../../utils/helpers/token.utils");
const { hashItem, compareItems } = require("../../utils/helpers/bcrypt.utils");
const {
  validateEmail,
  validateUSAMobileNumber,
  titleCase,
} = require("../../utils/helpers/validator.utils");
const {
  removeNullUndefined,
  generateOTP,
  randomString,
} = require("../../utils/helpers/common.utils");
const { sendMail } = require("../../utils/helpers/email.utils");
const { contactUs } = require("../../controllers/user/product.controllers");
const { twilioOTPService } = require("../../utils/helpers/twilio.utils");
const { deleteS3Object } = require("../../utils/helpers/files.helper");
const { sanitizedUserData } = require("../../utils/helpers/sanitize.util");
class UserService {
  async registerService(req, res) {
    try {
      const { firstName, lastName, email, password, phoneNumber } = req.body;
      if (!firstName || !lastName || !email || !password || !phoneNumber) {
        log.error("Error from [AUTH SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "please enter all fields",
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
      if (!validateUSAMobileNumber(phoneNumber)) {
        return res.status(400).json({
          message: "please enter valid phoneNumber",
          status: "fail",
          code: 201,
        });
      }
      const isExist = await userDao.getUserByEmail(email);
      if (isExist.data) {
        return res.status(201).json({
          message: "email already exist",
          status: "fail",
          code: 201,
          data: null,
        });
      }
      const isExistNumber = await userDao.getUserByContact(phoneNumber);
      if (isExistNumber.data) {
        return res.status(201).json({
          message: "phone number already exist",
          status: "fail",
          code: 201,
          data: null,
        });
      }

      const verificationToken = await randomString(25);
      const data = {
        firstName: titleCase(firstName),
        lastName: titleCase(lastName),
        email: email.toLowerCase(),
        contact: phoneNumber,
        password: await hashItem(password),
        verificationToken,
        isVerify: false,
      };

      const user = await userDao.createUser(data);

      const response = await sendMail({
        email: email,
        subject: "verify your account",
        emailData: {
          verificationToken,
        },
        emailType: "verify",
      });

      const token = await createToken(user.data.userId, "user");
      return res.status(200).json({
        status: "success",
        code: 200,
        message:
          "User created successfully. Please check your email to verify your account",
        data: await sanitizedUserData(user.data),
        token: token,
      });
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  // verify email
  async verifyTokenService(req, res) {
    try {
      const { token } = req.body;
      console.log("Sssssssssssssssss", token);
      if (!token) {
        return res.status(400).json({
          message: "Verification token is missing",
          status: "fail",
          code: 400,
        });
      }
      const user = await userDao.getUserByVerificationToken(token);
      if (!user.data) {
        return res.status(400).json({
          message: "Verification token has expired",
          status: "fail",
          code: 201,
        });
      }

      await userDao.updateUserVerificationStatus(user.data.userId);
      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Email successfully verified",
      });
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  //login
  async loginService(req, res) {
    try {
      const { email, password, contact } = req.body;
      if (email && password) {
        if (!email || !password) {
          log.error("Error from [AUTH SERVICES]: please enter all fields");
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
        const isEmailExist = await userDao.getUserByEmail(email);
        if (!isEmailExist.data) {
          return res.status(404).json({
            message: "email not exist",
            status: "fail",
            code: 201,
          });
        }

        if(!isEmailExist?.data?.password){
          return res.status(404).json({
            message: "login by google",
            status: "fail",
            code: 201,
          });
        }

        const userExist = await userDao.isUserVerified(email);
        let verificationToken;

        if (userExist.data == null) {
          return res.status(201).json({
            message: "Please check your email to verify your account",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        const isUserActive = await userDao.isUserActiveAndVerified(email);
        if (!isUserActive.data) {
          return res.status(201).json({
            message: "you are temporarily block contact administrator",
            status: "inActive",
            code: 201,
            data: null,
          });
        }

        const response = await compareItems(
          password.trim(),
          isUserActive.data.password
        );
        if (!response) {
          return res.status(201).json({
            message: "please enter valid password",
            status: "incorrectPassword",
            code: 201,
            data: null,
          });
        }

        const dataToSend = {
          _id: isUserActive.data._id,
          userId: isUserActive.data.userId,
          firstName: isUserActive.data.firstName,
          lastName: isUserActive.data.lastName,
          email: isUserActive.data.email,
          contact: isUserActive.data.contact,
          isActive: isUserActive.data.isActive,
          isVerify: isUserActive.data.isVerify,
          status: isUserActive.data.status,
          createdAt: isUserActive.data.createdAt,
          updatedAt: isUserActive.data.updatedAt,
        };

        const token = await createToken(isUserActive.data.userId, "user");
        return res.status(200).json({
          message: "user login successfully",
          status: "success",
          code: 200,
          data: await sanitizedUserData(isUserActive.data),
          token: token,
        });
      } else {
        if (!contact) {
          return res.status(201).json({
            message: "please enter contact number",
            code: 201,
            status: "fail",
          });
        }

        // if (!validateUSAMobileNumber(contact)) {
        //   return res.status(201).json({
        //     message: "please enter valid contact number",
        //     code: 201,
        //     status: "fail",
        //   });
        // }

        const isContactExist = await userDao.getUserByContact(contact);
        if (!isContactExist.data) {
          return res.status(404).json({
            message: "contact not exist",
            status: "fail",
            code: 201,
          });
        }
        const userExist = await userDao.isUserVerifiedContact(contact);
        if (userExist.data == null) {
        }

        const isUserActive = await userDao.isUserActiveAndVerifiedContact(
          contact
        );

        if (!isUserActive.data) {
          return res.status(201).json({
            message: "you are temporarily block contact administrator",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        let otp = null;
        // const otp = await generateOTP();

        otp = 123456;
        const otpData = {
          otp,
        };

        // const result = await twilioOTPService(contact,otp);
        const dataToUpdate = removeNullUndefined(otpData);
        const userInfo = await userDao.updateUserOTP(
          undefined,
          contact,
          dataToUpdate
        );
        return res.status(200).json({
          message: "otp sent successfully",
          code: 200,
          data: otp,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  //forgetPassword
  async forgetPasswordService(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        log.error("Error from [AUTH SERVICES]: please enter email");
        return res.status(400).json({
          message: "please enter email",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      if (!validateEmail(email)) {
        log.error("Error from [User SERVICE]: Invalid Email Address");
        return res.status(400).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }

      const isUserExist = await userDao.getUserByEmail(email);
      console.log(isUserExist);
      if (!isUserExist.data) {
        return res.status(201).json({
          message: "email does not exist",
          status: "failed",
          code: 201,
          data: null,
        });
      }
      const otp = await generateOTP();
      const emailData = {
        otp,
      };

      const dataToUpdate = removeNullUndefined(emailData);
      const userInfo = await userDao.updateUserOTP(
        email,
        undefined,
        dataToUpdate
      );
      const response = await sendMail({
        email: email,
        subject: "Reset your Password",
        emailData,
        emailType: "otp",
      });

      log.info("email sent successfully");
      return res.status(200).json({
        message: "OTP Sent Successfully; Please Check Your Email",
        status: "success",
        code: 200,
        data: userInfo.data,
      });
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  //verify otp
  async verifyOtpService(req, res) {
    try {
      const { email, otp, contact } = req.body;
      if (!otp) {
        return res.status(404).json({
          message: "something went wrong",
          status: "fail",
          code: null,
        });
      }
      if (email) {
        if (!validateEmail(email)) {
          log.error("Error from [User SERVICE]: Invalid Email Address");
          return res.status(400).json({
            message: "please enter valid email",
            status: "fail",
            code: 201,
          });
        }

        const isValid = await userDao.getUserByOtp(email, undefined);
        if (!isValid.data) {
          return res.status(404).json({
            message: "otp has expired",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        if (otp != isValid.data.otp) {
          return res.status(404).json({
            message: "invalid OTP",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        const dataToUpdate = {
          otp: null,
        };

        const updatedData = await userDao.updateUserOTP(
          email,
          undefined,
          dataToUpdate
        );
        return res.status(200).json({
          message: "OTP verified successfully",
          status: "success",
          code: 200,
          data: updatedData.data,
        });
      } else {
        if (!validateUSAMobileNumber(contact)) {
          return res.status(201).json({
            message: "please enter valid contact number",
            code: 201,
            status: "fail",
          });
        }
        const isValid = await userDao.getUserByOtp(undefined, contact);
        if (!isValid.data) {
          return res.status(404).json({
            message: "otp has expired",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        if (otp != isValid.data.otp) {
          return res.status(404).json({
            message: "invalid OTP",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        const dataToUpdate = {
          otp: null,
        };

        const updatedData = await userDao.updateUserOTP(
          undefined,
          contact,
          dataToUpdate
        );

        const isUserActive = await userDao.isUserActiveAndVerifiedContact(
          contact
        );

        if (!isUserActive.data) {
          return res.status(201).json({
            message: "you are temporarily block contact administrator",
            status: "inActive",
            code: 201,
            data: null,
          });
        }
        const dataToSend = {
          _id: isUserActive.data._id,
          userId: isUserActive.data.userId,
          firstName: isUserActive.data.firstName,
          lastName: isUserActive.data.lastName,
          email: isUserActive.data.email,
          contact: isUserActive.data.contact,
          isActive: isUserActive.data.isActive,
          isVerify: isUserActive.data.isVerify,
          status: isUserActive.data.status,
          createdAt: isUserActive.data.createdAt,
          updatedAt: isUserActive.data.updatedAt,
        };
        const token = await createToken(isUserActive.data.userId, "user");
        return res.status(200).json({
          message: "user login successfully",
          status: "success",
          code: 200,
          data: dataToSend,
          token: token,
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  //reSendOtpService
  async reSendOtpService(req, res) {
    const { email, contact } = req.body;
    try {
      if (email) {
        if (!validateEmail(email)) {
          log.error("Error from [User SERVICE]: Invalid Email Address");
          return res.status(400).json({
            message: "please enter valid email",
            status: "fail",
            code: 201,
          });
        }

        const isUserExist = await userDao.getUserByEmail(email);
        if (!isUserExist.data) {
          return res.status(404).json({
            message: "user not found",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        const otp = await generateOTP();
        const emailData = {
          otp,
        };

        const dataToUpdate = removeNullUndefined(emailData);
        const userInfo = await userDao.updateUserOTP(
          email,
          undefined,
          dataToUpdate
        );
        const response = await sendMail({
          email: email,
          subject: "Reset your Password",
          emailData,
          emailType: "otp",
        });

        log.info("email sent successfully");
        return res.status(200).json({
          message: "OTP Sent Successfully; Please Check Your Email",
          status: "success",
          code: 200,
          data: userInfo.data,
        });
      } else {
        if (!validateUSAMobileNumber(contact)) {
          return res.status(201).json({
            message: "please enter valid contact number",
            code: 201,
            status: "fail",
          });
        }

        const isUserExist = await userDao.getUserByContact(contact);
        if (!isUserExist.data) {
          return res.status(404).json({
            message: "user not found",
            status: "fail",
            code: 201,
            data: null,
          });
        }

        let otp = null;
        // const otp = await generateOTP();

        otp = 12345678;
        const otpData = {
          otp,
        };

        // const result = await twilioOTPService(contact);
        const dataToUpdate = removeNullUndefined(otpData);
        const userInfo = await userDao.updateUserOTP(
          undefined,
          contact,
          dataToUpdate
        );
        return res.status(200).json({
          message: "otp sent successfully",
          code: 200,
          data: await sanitizedUserData(userInfo.data),
        });
      }
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }

  //set new password
  async setNewPasswordService(req, res) {
    try {
      const { email, password, confirmPassword } = req.body;
      if (!email || !password || !confirmPassword) {
        log.error("Error from [User SERVICE]: All Fields Are Mandatory");
        return res.status(400).json({
          message: "something went wrong",
          code: 201,
          status: "fail",
        });
      }

      if (!validateEmail(email)) {
        log.error("Error from [User SERVICE]: Invalid Email Address");
        return res.status(400).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }
      const isEmailExist = await userDao.getUserByEmail(email);
      if (!isEmailExist.data) {
        return res.status(400).json({
          message: "email not found",
          code: 201,
          status: "fail",
        });
      }
      if (password !== confirmPassword) {
        log.error(
          "Error from [User SERVICE]: Password and reEnterPassword not match"
        );
        return res.status(400).json({
          message: "Password and reEnterPassword not match",
          code: 201,
          status: "fail",
        });
      }
      const data = {
        password: await hashItem(password),
      };
      const updatedUser = await userDao.updatePassword(email, data);
      console.log(updatedUser);
      return res.status(200).json({
        message: "new password saved successfully",
        status: "success",
        code: 200,
      });
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }
  //editProfileService
  async editProfileService(req, res) {
    try {
      const {
        firstName,
        lastName,
        currentPassword,
        newPassword,
        confirmNewPassword,
        email,
        phoneNumber,
      } = req.body;
      const userId = req.userId;

      console.log("ddddddddddddddd", req.body);
      if (!userId) {
        log.error("Error from [User SERVICE]: All Fields Are Mandatory");
        return res.status(400).json({
          message: "please enter all fields",
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

      const result = await userDao.getUser(userId);
      if (!result.data) {
        return res.status(400).json({
          message: "user not found",
          success: "fail",
          code: 201,
        });
      }

      console.log("result", result.data);
      let updatedPassword;
      if (currentPassword) {
        const ans = await compareItems(currentPassword, result.data.password);
        if (!ans) {
          return res.status(201).json({
            message: "please enter valid current password",
            success: "fail",
            code: 201,
          });
        }

        if (newPassword !== confirmNewPassword) {
          log.error(
            "Error from [User SERVICE]: new password or confirm Password not match"
          );
          return res.status(400).json({
            message: "new password or confirm Password not match",
            code: 201,
            status: "fail",
          });
        }
        updatedPassword = await hashItem(newPassword);
      } else {
        const loginType = result.data.loginType;
        if (loginType) {
          if (newPassword) {
            if (newPassword !== confirmNewPassword) {
              log.error(
                "Error from [User SERVICE]: new password or confirm Password not match"
              );
              return res.status(400).json({
                message: "new password or confirm Password not match",
                code: 201,
                status: "fail",
              });
            }
            updatedPassword = await hashItem(newPassword);
          }
        }
      }

      let data = {
        firstName,
        lastName,
        contact: phoneNumber,
      };

      if (newPassword) {
        data.password = updatedPassword;
      }

      console.log("ffffffffffffff", newPassword);

      const updatedData = removeNullUndefined(data);
      console.log("...................", updatedData);
      const updatedUser = await userDao.updateUser(userId, updatedData);
      console.log("...........", updatedUser);
      const newData = await sanitizedUserData(updatedUser.data);
      console.log("cccccccccccccccccccccccc", newData);
      return res.status(200).json({
        message: "user profile updated successfully",
        status: "success",
        code: 200,
        data: newData,
      });
    } catch (error) {
      log.error("error from [AUTH SERVICE]: ", error);
      throw error;
    }
  }
  //getUserDetailService
  async getUserDetailService(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        log.error("Error from [User SERVICE]: All Fields Are Mandatory");
        return res.status(400).json({
          message: "something went wrong",
          code: 201,
          status: "fail",
        });
      }
      const result = await userDao.getUser(userId);
      console.log("sssssssssss", result);
      if (result.data) {
        return res.status(200).json({
          message: "user get successfully",
          success: "success",
          code: 200,
          data: await sanitizedUserData(result.data),
        });
      } else {
        return res.status(201).json({
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

  //googleService
  async socialLoginService(req, res) {
    try {
      const { firstName, lastName, email, accessToken, loginType } = req.body;
      console.log("body", req.body);
      if (!firstName || !email) {
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
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

      const isExist = await userDao.getUserByEmail(email);
      const data = {
        firstName: titleCase(firstName),
        lastName: titleCase(lastName),
        email: email.toLowerCase(),
        accessToken,
        loginType,
      };

      let result = null;
      let token = null;

      if (isExist.data) {
        if (isExist?.data?.isVerify === false) {
          return res.status(201).json({
            message: "Please verify your account before logging in.",
            status: "fail",
            code: 200,
            data: null,
          });
        }

        const isUserActive = await userDao.isUserActiveAndVerified(email);
        if (!isUserActive.data) {
          return res.status(201).json({
            message: "you are temporarily block contact administrator",
            status: "In Active",
            code: 201,
            data: null,
          });
        }
        result = isExist.data;
      } else {
        const verificationToken = await randomString(25);
        data.verificationToken = verificationToken;
        data.isVerify = false;
        const userInfo = await userDao.createUser(data);
        const response = await sendMail({
          email: email,
          subject: "verify your account",
          emailData: {
            verificationToken,
          },
          emailType: "verify",
        });
        result = userInfo.data;
      }

      if (result) {
        token = await createToken(result.userId, "user");
        return res.status(200).json({
          message: isExist.data
            ? "Login successful."
            : "User created successfully. Please see your registered email to verify your account.",
          status: "success",
          code: 200,
          data: await sanitizedUserData(result),
          token: token,
        });
      } else {
        return res.status(200).json({
          message: "error occur while login",
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

  //horseProfileService
  async horseProfileService(req, res) {
    try {
      const userId = req.userId;
      const { horseName, horseBreed, horseAge } = req.body;
      if (!userId || !horseName || !horseBreed || !horseAge) {
        log.error("Error from [USER SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "failed",
          data: null,
          code: 201,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(200).json({
          message: "user not found",
          status: "fail",
          data: null,
        });
      }
      let imgArray = [];

      if (req.files.images && req.files.images.length > 0) {
        await Promise.all(
          req.files.images.map((img) => {
            imgArray.push(img.location);
          })
        );
      }

      let doc = [];

      if (req.files.docs && req.files.docs.length > 0) {
        await Promise.all(
          req.files.docs.map((img) => {
            doc.push(img.location);
          })
        );
      }
      const horseDetails = {
        horseName,
        horseBreed,
        horseAge,
        images: imgArray,
        horseDocument: doc,
      };

      const data = {
        userId,
        horseDetail: horseDetails,
      };

      const userDetail = await userDao.updateHorseDetail(data);
      if (userDetail.data) {
        return res.status(200).send({
          message: "horse saved successfully",
          success: "success",
          data: userDetail.data,
          code: 200,
        });
      } else {
        return res.status(201).send({
          message: "horse save fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICE]: ", error);
      throw error;
    }
  }

  //horseProfileUpdateService
  async horseProfileUpdateService(req, res) {
    try {
      const userId = req.userId;
      const { horseId, horseName, horseBreed, horseAge } = req.body;
      if (!userId || !horseId) {
        log.error("Error from [USER SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "failed",
          data: null,
          code: 201,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(200).json({
          message: "user not found",
          status: "fail",
          data: null,
        });
      }

      const isHorseExist = await userDao.getHorseDetailById(userId, horseId);
      if (!isHorseExist.data) {
        return res.status(200).json({
          message: "horse not found",
          status: "fail",
          data: null,
        });
      }

      let horse = isHorseExist.data;

      console.log("ffffffffffffffffff", horse);

      let newImageArray = [];
      if (req.files.images && req.files.images.length > 0) {
        await Promise.all(
          horse.images.map(async (img) => await deleteS3Object(img))
        );
        await Promise.all(
          req.files.images.map((img) => {
            newImageArray.push(img.location);
          })
        );
      } else {
        newImageArray = horseDetail.images;
      }

      let doc = [];

      if (req.files.docs && req.files.docs.length > 0) {
        await Promise.all(
          horse.horseDocument.map(async (img) => await deleteS3Object(img))
        );
        await Promise.all(
          req.files.docs.map((img) => {
            doc.push(img.location);
          })
        );
      } else {
        doc = horseDetail.horseDocument;
      }

      const horseDetail = {
        horseName,
        horseBreed,
        horseAge,
        images: newImageArray,
        horseDocument: doc,
      };

      const userDetail = await userDao.updateHorseProfile(
        userId,
        horseId,
        horseDetail
      );

      if (userDetail.data) {
        return res.status(200).send({
          message: "horse detail updated",
          success: "success",
          data: userDetail.data,
          code: 200,
        });
      } else {
        return res.status(201).send({
          message: "horse update fail",
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
  async horseDeleteService(req, res) {
    try {
      const userId = req.userId;
      const { horseId } = req.body;
      if (!userId || !horseId) {
        log.error("Error from [USER SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "failed",
          data: null,
          code: 201,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(200).json({
          message: "user not found",
          status: "fail",
          data: null,
        });
      }

      const isHorseExist = await userDao.getHorseDetailById(userId, horseId);
      if (!isHorseExist.data) {
        return res.status(200).json({
          message: "horse not found",
          status: "fail",
          data: null,
        });
      }

      const userDetail = await userDao.deleteHorseDetail(userId, horseId);
      console.log("cccccccccccccccccccccccccccccccccccccc", userDetail);

      if (userDetail.data) {
        return res.status(200).send({
          message: "horse detail deleted",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).send({
          message: "horse delete fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICE]: ", error);
      throw error;
    }
  }

  //getHorseByIdService
  async getHorseByIdService(req, res) {
    try {
      const userId = req.userId;
      const { horseId } = req.body;
      if (!userId || !horseId) {
        log.error("Error from [USER SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "failed",
          data: null,
          code: 201,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(200).json({
          message: "user not found",
          status: "fail",
          data: null,
        });
      }

      const isHorseExist = await userDao.getHorseDetailById(userId, horseId);

      if (isHorseExist.data) {
        return res.status(200).send({
          message: "horse detail get successfully",
          success: "success",
          data: isHorseExist.data,
          code: 200,
        });
      } else {
        return res.status(201).send({
          message: "horse not found",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICE]: ", error);
      throw error;
    }
  }

  //getAllHorseOfUserService
  async getAllHorseOfUserService(req, res) {
    try {
      const userId = req.userId;
      if (!userId) {
        log.error("Error from [USER SERVICES]: please enter all fields");
        return res.status(400).json({
          message: "something went wrong",
          success: "failed",
          data: null,
          code: 201,
        });
      }

      const isUserExist = await userDao.getUserById(userId);
      if (!isUserExist.data) {
        return res.status(200).json({
          message: "user not found",
          status: "fail",
          data: null,
        });
      }

      const userDetail = await userDao.getHorseDetail(userId);
      console.log("vvvvvvvvvvvvvvvvvvvvvvvv", userDetail.data);
      if (userDetail.data) {
        return res.status(200).send({
          message: "horse get successfully",
          success: "success",
          data: userDetail.data,
          code: 200,
        });
      } else {
        return res.status(201).send({
          message: "horse not found",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [USER SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new UserService();
