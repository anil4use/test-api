const mongoose = require("mongoose");
const cron = require("node-cron");
const Order = require("../../models/order/order.model");

const startOrderCleanupJob = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const unpaidOrderCount = await Order.countDocuments({
        orderStatus: "unpaid",
        createdAt: { $lte: tenMinutesAgo },
      });

      if (unpaidOrderCount > 0) {
        const result = await Order.deleteMany({
          orderStatus: "unpaid",
          createdAt: { $lte: tenMinutesAgo },
        });

        console.log(`Deleted ${result.deletedCount} unpaid orders.`);
      }
    } catch (error) {
      console.error("Error deleting unpaid orders:", error);
    }
  });
};
module.exports = startOrderCleanupJob;
