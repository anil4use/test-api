const mongoose = require("mongoose");
const cron = require("node-cron");
const Order = require("../../models/order/order.model");

const startOrderCleanupJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const result = await Order.deleteMany({
        orderStatus: "unpaid",
        createdAt: { $lte: tenMinutesAgo },
      });
    } catch (error) {
      console.error("Error deleting unpaid orders:", error);
    }
  });
};
module.exports = startOrderCleanupJob;
