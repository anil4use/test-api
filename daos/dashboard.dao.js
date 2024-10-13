const userModel = require("../models/user.model");
const productModel = require("../models/product/product.model");
const log = require("../configs/logger.config");
const getNextSequenceValue = require("../utils/helpers/counter.utils");
const serviceModel = require("../models/service/service.model");
const barnModel = require("../models/barn/barn.model");
const staffModel = require("../models/staff/staff.model");
const moment = require("moment-timezone");
const orderModel = require("../models/order/order.model");

class DashboardDao {
  async dashboard(monthName) {
    try {
      const timeZone = "America/New_York";
      const now = moment().tz(timeZone);
      const startOfDay = moment().tz(timeZone).startOf("day").toDate();
      const endOfDay = moment().tz(timeZone).endOf("day").toDate();

      const details = await productModel.aggregate([
        {
          $match: {
            updatedAt: { $gte: startOfDay, $lte: endOfDay },
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$sales" },
            totalProducts: { $sum: 1 },
          },
        },
      ]);

      console.log("Start of day:", startOfDay);
      console.log("End of day:", endOfDay);

      const todaysProductSold = details.length ? details[0].totalSales : 0;
      const totalProducts = await productModel.countDocuments();
      const totalServices = await serviceModel.countDocuments();
      const totalBarns = await barnModel.countDocuments();
      const totalAdmins = await staffModel
        .find({ type: "admin" })
        .countDocuments();
      const totalActiveUsers = await userModel
        .find({ isActive: true })
        .countDocuments();
      const totalUsers = await userModel.find({}).countDocuments();

      // //monthly salses

      // const startOfYear = now.clone().startOf("year").toDate();
      // const startOfNextMonth = now
      //   .clone()
      //   .add(1, "month")
      //   .startOf("month")
      //   .toDate();

      // let monthlySales = [];

      // if (monthName) {
      //   const monthIndex = moment().month(monthName).month();
      //   if (monthIndex >= 0 && monthIndex < 12) {
      //     const startOfMonth = now
      //       .clone()
      //       .month(monthIndex)
      //       .startOf("month")
      //       .toDate();
      //     const endOfMonth = now
      //       .clone()
      //       .month(monthIndex)
      //       .endOf("month")
      //       .toDate();

      //     console.log("start of month", startOfMonth);
      //     console.log("end of month", endOfMonth);
      //     console.log("Fetching sales for:", monthName);

      //     monthlySales = await orderModel.aggregate([
      //       {
      //         $match: {
      //           createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      //           orderStatus: "paid",
      //         },
      //       },
      //       {
      //         $group: {
      //           _id: { $month: "$paidAt" },
      //           total: { $sum: "$totalPrice" },
      //         },
      //       },
      //       {
      //         $sort: {
      //           _id:1,
      //         },
      //       },
      //     ]);
      //   }

      //   console.log("monthly salsses", monthlySales);
      // } else {
      //   monthlySales = await orderModel.aggregate([
      //     {
      //       $match: {
      //         createdAt: { $gte: startOfYear, $lt: startOfNextMonth },
      //         orderStatus: "Paid",
      //       },
      //     },
      //     {
      //       $group: {
      //         _id: { $month: "$paidAt" },
      //         total: { $sum: "$totalPrice" },
      //       },
      //     },
      //     {
      //       $sort: {
      //         _id: 1,
      //       },
      //     },
      //   ]);
      // }

      // console.log("dsffffffffffffff",monthlySales);
      // const monthlySalesArray = new Array(12).fill(0);
      // monthlySales.forEach(({ _id, total }) => {
      //   monthlySalesArray[_id - 1] = total;
      // });

      // console.log("dsaaaaaaaaf",monthlySalesArray);
      // //recent sale product

      // const items = await orderModel
      //   .find({ orderStatus: "paid" })
      //   .limit(5)
      //   .sort({ _id: -1 });

      // let orderItems = [];
      // if (items.length > 0) {
      //   orderItems = items.flatMap((data) => data.orderItems);
      // }





      //////////////////////////////////////////
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1); 
      const startOfNextMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );
  
      const countsByMonth = Array.from({ length: today.getMonth() + 1 }, () => 0);
      const countsByMonthOrder = Array.from(
        { length: today.getMonth() + 1 },
        () => 0
      );
  
      const countsBySales = Array.from({ length: today.getMonth() + 1 }, () => 0);
  
      // ************* TOTAL SALES Month Wise PAYMENT ******************
      const SalesCreated = await orderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear, $lt: startOfNextMonth },
            orderStatus: "paid",
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            total: { $sum: "$totalPrice" },
          },
        },
        {
          $sort: {
            "_id.month": 1,
          },
        },
      ]);
      SalesCreated.forEach(({ _id, total }) => {
        countsBySales[_id.month - 1] = total;
      });
      const total_amount_data = await orderModel.aggregate([
        {
          $match: {
            orderStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);
      let total_sales = 0;
      if (total_amount_data.length > 0) {
        total_sales = total_amount_data[0].total;
      }
  
      // *********************    Total Order Month Wise  ****************
      const OrderCreated = await orderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear, $lt: startOfNextMonth }, 
            orderStatus: "paid",
          },
        },
        {
          $group: {
            _id: { month: { $month: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.month": 1, // Sort by month
          },
        },
      ]);
      OrderCreated.forEach(({ _id, count }) => {
        countsByMonthOrder[_id.month - 1] = count;
      });
        
      ////////////
      //top selling product

      const topSellProduct=await productModel.find().sort({ sales: -1 }).limit(5).select("productId  name price coverImage sales isActive");

      let recentSelling=await orderModel.find({ orderStatus: "paid"}).sort({ _id: -1 }).limit(5).select("orderId orderItems.name orderItems.coverImage orderItems.reducedPrice orderItems.originalPrice orderItems.discount orderItems.quantity");

      const result = {
        totalActiveUsers,
        totalUsers,
        totalAdmins,   
        totalBarns,
        totalServices,
        totalProducts,
        // todaysProductSold,
        monthlySales: countsByMonthOrder,
        recentSelling:recentSelling,
        topSellingProduct:topSellProduct
      };

      if (result) {
        return {
          message: "dashboard details get successfully",
          success: "success",
          code: 200,
          data: result,
        };
      } else {
        return {
          message: "dashboard detail not found",
          success: "fail",
          code: 201,
          data: null,
        };
      }
    } catch (error) {
      log.error("Error from [DASHBOARD DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new DashboardDao();
