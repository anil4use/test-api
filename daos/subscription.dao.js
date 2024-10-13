const getNextSequenceValue = require("../utils/helpers/counter.utils");
const log = require("../configs/logger.config");
const subscriptionModel = require("../models/subscription/subscription.model");

class SubscriptionDao {
  async addSubscription(data) {
    try {
      const subsnId = "Subsn_" + (await getNextSequenceValue("subscription"));
      data.subsnId = subsnId;

      const subsnInfo = new subscriptionModel(data);
      const result = await subsnInfo.save();
      log.info("subscription saved");
      if (result) {
        return {
          message: "subscription created successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        log.error(
          "Error from [SUBSCRIPTION DAO] : subscription creation error"
        );
        throw error;
      }
    } catch (error) {
      log.error("Error from [SUBSCRIPTION DAO] : ", error);
      throw error;
    }
  }
  async updateSubscription(subsnId, data) {
    try {
      const result = await subscriptionModel.findOneAndUpdate(
        { subsnId: subsnId },
        data,
        {
          new: true,
        }
      );
      if (result) {
        return {
          message: "subscription update successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subscription update fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [subscription DAO] : ", error);
      throw error;
    }
  }
  async getSubscriptionById(subsnId) {
    try {
      const result = await subscriptionModel.findOne({
        subsnId: subsnId,
      });
      if (result) {
        return {
          message: "subscription get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subscription not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [subscription DAO] : ", error);
      throw error;
    }
  }

  async deleteSubscriptionById(subsnId) {
    try {
      const result = await subscriptionModel.findOneAndDelete({
        subsnId: subsnId,
      });
      if (result) {
        return {
          message: "subscription deleted successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subscription delete fail",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [subscription DAO] : ", error);
      throw error;
    }
  }

  async getAllSubscription() {
    try {
      const result = await subscriptionModel.find().sort({ _id: -1 });

      if (result) {
        return {
          message: "subscription get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subscription not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [subscription DAO] : ", error);
      throw error;
    }
  }
  async getSubscription(subsnId) {
    try {
      const result = await subscriptionModel.findOne({ subsnId: subsnId });

      if (result) {
        return {
          message: "subscription get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subscription not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [subscription DAO] : ", error);
      throw error;
    }
  }
  //getAllSubscriptionForUser
  async getAllSubscriptionForUser() {
    try {
      const result = await subscriptionModel
        .find({ isActive: true })
        .sort({ _id: -1 });
      if (result) {
        return {
          message: "subscription get successfully",
          status: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "subscription not found",
          status: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [subscription DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new SubscriptionDao();
