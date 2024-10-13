const subscription = require("../../services/user/subscription.services");
class SubscriptionController{
    async getAllSubscription(req, res) {
        try {
          const result = await subscription.getAllSubscriptionService(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }
      //purchaseSubPlan
      async purchaseSubPlan(req, res) {
        try {
          const result = await subscription.purchaseSubPlanService(req, res);
          return result;
        } catch (error) {
          throw error;
        }
      }
}
module.exports=new SubscriptionController();