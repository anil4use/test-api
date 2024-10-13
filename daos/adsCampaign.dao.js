const getNextSequenceValue = require("../utils/helpers/counter.utils");
const log = require("../configs/logger.config");
const adsCampaignModel = require("../models/ads/adsCampaign.model");

class AdsCampaignDao {
  async addCampaign(data) {
    try {
      const adsId = "Ads_" + (await getNextSequenceValue("adsCampaign"));
      data.adsId = adsId;

      const adsInfo = new adsCampaignModel(data);
      const result = await adsInfo.save();
      log.info("ads saved");
      if (result) {
        return {
          message: "ads created successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error("Error from [ADS DAO] : ads creation error");
        throw error;
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }
  async updateAdsCampaign(adsId, data) {
    try {
      const result = await adsCampaignModel.findOneAndUpdate(
        { adsId: adsId },
        data,
        {
          new: true,
        }
      );
      if (result) {
        return {
          message: "ads update successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "ads update fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
      0;
    }
  }
  async getAdsCampaignById(adsId) {
    try {
      const result = await adsCampaignModel.findOne({
        adsId: adsId,
      });
      if (result) {
        return {
          message: "ads get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "ads not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }

  async deleteAdsCampaignById(adsId) {
    try {
      const result = await adsCampaignModel.findOneAndDelete({
        adsId: adsId,
      });
      if (result) {
        return {
          message: "ads deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "ads delete fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }

  async getAllCampaign() {
    try {
      const result = await adsCampaignModel
        .find()
        .populate([
          {
            path: "productId",
            localField: "Product",
            foreignField: "productId",
          },
          {
            path: "serviceId",
            localField: "Service",
            foreignField: "serviceId",
          },
          {
            path: "barnId",
            localField: "Barn",
            foreignField: "barnId",
          },
        ])
        .sort({ _id: -1 });

      if (result) {
        return {
          message: "ads get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }
  //getAdsCampaign
  async getAdsCampaign(adsId) {
    try {
      const result = await adsCampaignModel
        .findOne()
        .populate([
          {
            path: "productId",
            localField: "Product",
            foreignField: "productId",
          },
          {
            path: "serviceId",
            localField: "Service",
            foreignField: "serviceId",
          },
          {
            path: "barnId",
            localField: "Barn",
            foreignField: "barnId",
          },
        ])
        .sort({ _id: -1 });

      if (result) {
        return {
          message: "ads get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new AdsCampaignDao();
