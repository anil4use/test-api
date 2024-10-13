const log = require("../configs/logger.config");
const contactUsModel = require("../models/contactUs.model");
const getNextSequenceValue = require("../utils/helpers/counter.utils");

class ContactUs {
  async contactUs(data) {
    try {
      const enquiryId = "Enquiry_" + (await getNextSequenceValue("enquiry"));
      data.enquiryId = enquiryId;
      const contactUseDetail = new contactUsModel(data);
      const result = await contactUseDetail.save();
      if (result) {
        return {
          message: "detail saved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "detail not saved",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("error from [CONTACT US DAO] : ", error);
      throw error;
    }
  }

  //getContactUsDetails;
  async getContactUsDetails() {
    try {
      const result = await contactUsModel.find({}).sort({ _id: -1 });
      if (result) {
        return {
          message: "detail get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "detail not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("error from [CONTACT US DAO] : ", error);
      throw error;
    }
  }

  //getEnquiryById

  async getEnquiryById(enquiryId) {
    try {
      const result = await contactUsModel.findOne({ enquiryId });
      if (result) {
        return {
          message: "enquiry retrieved successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "enquiry not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("error from [CONTACT US DAO] : ", error);
      throw error;
    }
  }

  //deleteContactUsById
  async deleteContactUsById(enquiryId) {
    try {
      const result = await contactUsModel.findOneAndDelete({ enquiryId });
      if (result) {
        return {
          message: "enquiry deleted successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "enquiry not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("error from [CONTACT US DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new ContactUs();
