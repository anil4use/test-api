const Auth = require("./auth.routes");
const User = require("./users.routes");
const Product = require("./catSubCatProductRoutes/product.routes");
const Admin = require("./admin.routes");
const Barn = require("./barn.routes");
const Service = require("./service.routes");
const Category = require("./catSubCatProductRoutes/category.routes");
const SubCategory = require("./catSubCatProductRoutes/subCategory.routes");
const ServiceCategory = require("./servicecategory.routes");
const StaffAndRole = require("./staff.routes");
const Coupons = require("./coupon.routes");
const Dashboard=require("./dashboard.routes");
const Career=require("./job.routes")
const CareerCategory=require("./jobCategory.routes");
const TransactionHistory=require("./transactionHistory.routes");
const AdsCampaign=require("./AdsCampaign.routes");
const Subscription=require("./subscription.routes");
const Event=require("./event.routes");
module.exports = {
  Auth,
  User,
  Product,
  Category,
  SubCategory,
  Admin,
  Barn,
  Service,
  ServiceCategory,
  StaffAndRole,
  Coupons,
  Dashboard,
  Career,
  CareerCategory,
  TransactionHistory,
  AdsCampaign,
  Subscription,
  Event
};
