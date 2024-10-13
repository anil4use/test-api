const log = require("../configs/logger.config");
const userModel = require("../models/user.model");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
const { hashItem } = require("../utils/helpers/bcrypt.utils");

class UserDao {
  async getUserByContact(contact) {
    try {
      console.log("cccccccccccccccccccccc", contact);
      const result = await userModel.findOne({ contact: contact });
      console.log("fffffffffffff", result);
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }
  async getUserById(userId) {
    try {
      const user = await userModel.findOne({ userId: userId }, { password: 0 });
      console.log("ggggggggggggggg", user);
      if (!user) {
        return {
          message: "user not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
      const result = {
        _id: user._id,
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contact: user.contact,
        type: user.type,
        isActive: user.isActive,
        isVerify: user.isVerify,
        businessName: user.businessName,
        businessAddress: user.businessAddress,
        homeAddress: user.homeAddress,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }

  //getUserByOtp
  async getUserByOtp(email, contact, otp) {
    try {
      let result = null;
      if (email) {
        result = await userModel.findOne({ email: email });
      } else {
        result = await userModel.findOne({ contact: contact });
      }
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
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

  async createUser(data) {
    try {
      const userId = "User_" + (await getNextSequenceValue("user"));
      data.userId = userId;
      const user = new userModel(data);
      const userInfo = await user.save();
      log.info("User saved");
      console.log(userInfo.status);
      if (userInfo.homeAddress === undefined) {
        if (user) {
          return {
            message: "User creation successful",
            status: "success",
            code: 200,
            data: userInfo,
          };
        } else {
          log.error("Error from [USER DAO] : user creation error");
          throw error;
        }
      }

      const result = {
        _id: userInfo._id,
        userId: userInfo.userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        contact: userInfo.contact,
        type: userInfo.type,
        isVerify: userInfo.isVerify,
        businessName: userInfo.businessName,
        businessAddress: userInfo.businessAddress,
        homeAddress: userInfo.homeAddress,
        status: userInfo.status,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      };
      if (user) {
        return {
          message: "User creation successful",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [USER DAO] : user creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }

  //deleteUser
  async deleteUserById(userId) {
    try {
      const result = await userModel.findOneAndDelete({ userId });
      if (result) {
        return {
          message: "user delete successfully",
          status: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }
  //get user by email
  async getUserByEmail(email) {
    try {
      console.log("ds", email);
      const result = await userModel.findOne({ email: email.toLowerCase() });
      console.log("Sdddddddddddddd", result);
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
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

  //makeUserVerify
  async makeUserVerify(email) {
    try {
      console.log(email);
      const result = await userModel.findOneAndUpdate(
        { email: email.toLowerCase() },
        { isVerify: true },
        {
          new: true,
        }
      );
      console.log(result);
      if (result) {
        return {
          message: "user varify updated",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user varify failed",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }

  //makeUserVerify
  async makeUserVerifyContact(contact) {
    try {
      const result = await userModel.findOneAndUpdate(
        { contact: contact },
        { isVerify: true },
        {
          new: true,
        }
      );
      console.log(result);
      if (result) {
        return {
          message: "user varify updated",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user varify failed",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }

  //is user verified
  async isUserVerified(email) {
    try {
      const result = await userModel.findOne({
        email: email.toLowerCase(),
        isVerify: true,
      });
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }
  async isUserVerifiedContact(contact) {
    try {
      const result = await userModel.findOne({
        contact: contact,
        isVerify: true,
      });
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }
  //is user active
  async isUserActiveAndVerified(email) {
    try {
      const result = await userModel.findOne({
        email: email.toLowerCase(),
        isVerify: true,
        isActive: true,
      });
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
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

  async isUserActiveAndVerifiedContact(contact) {
    try {
      const result = await userModel.findOne({
        contact: contact,
        isVerify: true,
        isActive: true,
      });
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
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

  //isUserActiveAndVerifiedContact
  async isUserActiveAndVerifiedContact(contact) {
    try {
      const result = await userModel.findOne({
        contact: contact,
        isVerify: true,
        isActive: true,
      });
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
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

  //updateHorseDetail
  async updateHorseDetail(data) {
    try {
      let result;
      const userInfo = await userModel.findOneAndUpdate(
        { userId: data.userId },
        { $push: { horseDetail: data.horseDetail } }
      );

      result = {
        _id: userInfo._id,
        userId: userInfo.userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        contact: userInfo.contact,
        type: userInfo.type,
        businessName: userInfo.businessName,
        businessAddress: userInfo.businessAddress,
        homeAddress: userInfo.homeAddress,
        horseDetail: userInfo.horseDetail,
        isActive: userInfo.isActive,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      };
      if (result) {
        return {
          message: "user updated",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }
  async updateUser(userId,data) {
    try {
      let result;
      const userInfo = await userModel.findOneAndUpdate(
        { userId:userId },
        data,
        {
          new: true,
        }
      );
      console.log("sssssssssssssssstttttttttttttt", userInfo);
      result = {
        _id: userInfo._id,
        userId: userInfo.userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        contact: userInfo.contact,
        type: userInfo.type,
        businessName: userInfo.businessName,
        businessAddress: userInfo.businessAddress,
        homeAddress: userInfo.homeAddress,
        isActive: userInfo.isActive,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      };
      if (result) {
        return {
          message: "user updated",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }

  //updateOTP
  async updateUserOTP(email, contact, dataToUpdate) {
    try {
      let result = null;
      if (email) {
        result = await userModel
          .findOneAndUpdate({ email: email }, dataToUpdate, {
            new: true,
          })
          .select("userId firstName lastName email contact");
        console.log(result);
      } else {
        console.log("contact", email, contact, dataToUpdate);
        result = await userModel
          .findOneAndUpdate({ contact: contact }, dataToUpdate, {
            new: true,
          })
          .select("userId firstName lastName email contact");
        console.log(result);
      }

      if (result) {
        return {
          message: "otp updated",
          status: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }

  async updatePassword(email, data) {
    try {
      const result = await userModel.findOneAndUpdate({ email: email }, data, {
        new: true,
      });
      if (result) {
        return {
          message: "user update successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user update fail",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }
  //getUser

  async getUser(userId) {
    try {
      const result = await userModel.findOne({ userId: userId });
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO] : ", error);
      throw error;
    }
  }

  //
  async updateHorseProfile(userId, horseId, horseDetail) {
    try {
      let result = null;
      const userInfo = await userModel.findOneAndUpdate(
        { userId, "horseDetail._id": horseId },
        {
          $set: {
            "horseDetail.$.horseName": horseDetail.horseName,
            "horseDetail.$.horseBreed": horseDetail.horseBreed,
            "horseDetail.$.horseAge": horseDetail.horseAge,
            "horseDetail.$.images": horseDetail.images,
            "horseDetail.$.horseDocument": horseDetail.horseDocument,
          },
        },
        { new: true }
      );

      result = {
        _id: userInfo._id,
        userId: userInfo.userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        contact: userInfo.contact,
        type: userInfo.type,
        businessName: userInfo.businessName,
        businessAddress: userInfo.businessAddress,
        homeAddress: userInfo.homeAddress,
        horseDetail: userInfo.horseDetail,
        isActive: userInfo.isActive,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      };

      if (result) {
        return {
          message: "horse update successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "horse update fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO]: ", error);
      throw error;
    }
  }
  //

  async deleteHorseDetail(userId, horseId) {
    try {
      let result = null;
      const userInfo = await userModel.findOneAndUpdate(
        { userId },
        { $pull: { horseDetail: { _id: horseId } } },
        { new: true }
      );

      result = {
        _id: userInfo._id,
        userId: userInfo.userId,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        contact: userInfo.contact,
        type: userInfo.type,
        businessName: userInfo.businessName,
        businessAddress: userInfo.businessAddress,
        homeAddress: userInfo.homeAddress,
        horseDetail: userInfo.horseDetail,
        isActive: userInfo.isActive,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      };

      if (result) {
        return {
          message: "horse detail deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "horse delete fail",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO]: ", error);
      throw error;
    }
  }

  //
  async getHorseDetailById(userId, horseId) {
    try {
      const user = await userModel.findOne(
        { userId, "horseDetail._id": horseId },
        { "horseDetail.$": 1 }
      );

      if (user && user.horseDetail.length > 0) {
        return {
          message: "Horse detail found",
          status: "success",
          code: 200,
          data: user.horseDetail[0],
        };
      } else {
        return {
          message: "horse delete fail",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO]: ", error);
      throw error;
    }
  }

  //getHorseDetail
  async getHorseDetail(userId) {
    try {
      console.log("qqqqqqqqqqqqqqqqq");
      const user = await userModel.findOne({ userId });

      console.log("qqqqqqqqqqqqqqqqq", user.horseDetail);

      if (user) {
        return {
          message: "Horse detail found",
          status: "success",
          code: 200,
          data: user.horseDetail,
        };
      } else {
        return {
          message: "horse detail not found",
          status: "failed",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [USER DAO]: ", error);
      throw error;
    }
  }

  //getUserByVerificationToken
  async getUserByVerificationToken(token) {
    try {
      const result = await userModel.findOne({
        verificationToken: token,
      });
      if (result) {
        return {
          message: "user found",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "user not found",
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

  //updateUserVerificationStatus
  async updateUserVerificationStatus(userId) {
    try {
      const result = await userModel.findOneAndUpdate(
        { userId: userId },
        {
          isVerify: true,
          verificationToken: null,
        },
        { new: true }
      );
      console.log("dsssssssssss");
      if (result) {
        return {
          message: "verify update",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "verify update fail",
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
}
module.exports = new UserDao();
