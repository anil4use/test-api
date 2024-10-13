const log = require("../../configs/logger.config");
const adsCampaignDao = require("../../daos/adsCampaign.dao");
const barnDao = require("../../daos/barn.dao");
const productDao = require("../../daos/product.dao");
const serviceDao = require("../../daos/service.dao");
const {
  titleCase,
  removeNullUndefined,
} = require("../../utils/helpers/common.utils");
const { validateEmail } = require("../../utils/helpers/validator.utils");

class AdsCampaignService {
  async addAdsCampaignService(req, res) {
    try {
      const { productId, serviceId, barnId, startDate, endDate, adsSection } =
        req.body;
      const adminId = req.userId;

      if (!adminId || !startDate || !endDate || !adsSection) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }

      if (productId) {
        const isExist = await productDao.getProductById(productId);
        if (!isExist.data) {
          return res.status(400).json({
            message: "product not found",
            status: "fail",
            code: 201,
          });
        }
      }

      if (serviceId) {
        const isExist = await serviceDao.getServiceById(serviceId);
        if (!isExist.data) {
          return res.status(400).json({
            message: "service not found",
            status: "fail",
            code: 201,
          });
        }
      }

      if (barnId) {
        const isExist = await barnDao.getBarnById(barnId);
        if (!isExist.data) {
          return res.status(400).json({
            message: "barn not found",
            status: "fail",
            code: 201,
          });
        }
      }

      const data = {
        productId,
        serviceId,
        barnId,
        startDate,
        endDate,
        adsSection,
      };

      const updatedData = removeNullUndefined(data);
      const result = await adsCampaignDao.addCampaign(updatedData);
      if (result.data) {
        return res.status(200).json({
          message: "adsCampaign added successfully",
          success: "success",
          code: 200,
        });
      }
    } catch (error) {
      log.error("Error from [ADS CAMPAIGN] : ", error);
      throw error;
    }
  }
  //getAllAdsCampaignService
  async getAllAdsCampaignService(req, res) {
    try {
      const adminId = req.userId;

      if (!adminId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }

      const result = await adsCampaignDao.getAllCampaign();
      if (result.data) {
        return res.status(200).json({
          message: "ads campaign get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(400).json({
          message: "ads campaign not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }
  //deleteAdsCampaignService
  async deleteAdsCampaignService(req, res) {
    try {
      const adminId = req.userId;
      const { adsId } = req.body;
      if (!adminId || !adsId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }

      const isExistAds = await adsCampaignDao.getAdsCampaignById(adsId);
      if (!isExistAds.data) {
        return res.status(400).json({
          message: "ads not found",
          success: "fail",
          code: 201,
        });
      }

      const result = await adsCampaignDao.deleteAdsCampaignById(adsId);
      if (result.data) {
        return res.status(200).json({
          message: "ads campaign deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "ads campaign deletion fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }
  //updateAdsCampaignService
  async updateAdsCampaignService(req, res) {
    try {
      const {
        adsId,
        productId,
        serviceId,
        barnId,
        startDate,
        endDate,
        adsSection,
        isActive,
      } = req.body;
      const adminId = req.userId;

      if (!adminId || !adsId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }

      const isExistAds = await adsCampaignDao.getAdsCampaignById(adsId);
      if (!isExistAds.data) {
        return res.status(400).json({
          message: "ads not found",
          success: "fail",
          code: 201,
        });
      }

      const data = {
        productId,
        serviceId,
        barnId,
        startDate,
        endDate,
        adsSection,
        isActive,
      };
      const updatedData = removeNullUndefined(data);
      const result = await adsCampaignDao.updateAdsCampaign(adsId, updatedData);
      if (result.data) {
        return res.status(200).json({
          message: "ads campaign updated successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(200).json({
          message: "ads campaign update fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }
  //getCouponByIdService
  async getCampaignByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { adsId } = req.body;
      if (!adminId || !adsId) {
        return res.status(400).json({
          message: "something went wrong",
          success: "success",
          code: 201,
          data: null,
        });
      }
      const isExistAds = await adsCampaignDao.getAdsCampaign(adsId);
      if (!isExistAds.data) {
        return res.status(400).json({
          message: "ads not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      return res.status(200).json({
        message: "ads get successfully",
        success: "success",
        code: 200,
        data: isExistAds.data,
      });
    } catch (error) {
      log.error("Error from [ADS DAO] : ", error);
      throw error;
    }
  }
}

module.exports = new AdsCampaignService();
