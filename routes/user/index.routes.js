const Auth = require("../user/user.routes");
const ReviewAndWishList = require("./reviewAndWish.routes");
const View = require("./view.routes");
const Address = require("./address.routes");
const Cart = require("./cart.routes");
const Payment = require("./payment.routes");
const Order = require("./order.routes");
const Service = require("./service.routes");
const Event = require("./event.routes");
const Career = require("./job.routes");
const Track = require("./track.routes");
const Barn = require("./barn.routes");
const Member = require("../admin/admin.routes");
const Chat = require("./chat.routes");
const RentalProduct = require("./rentalProduct.routes");
const SubScription=require("./subscription.routes");
const FedexIntegration=require("./fedexIntegration.routes")
module.exports = {
  Auth,
  ReviewAndWishList,
  View,
  Address,
  Cart,
  Order,
  Payment,
  Service,
  Event,
  Career,
  Track,
  Barn,
  Member,
  Chat,
  RentalProduct,
  SubScription,
  FedexIntegration
};
