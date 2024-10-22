const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const ejs = require("ejs");
const path = require("path");
const orderCleanupJob = require("./utils/helpers/crons.util");
require("./configs/db.config");
const {
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
  FedexIntegration,
} = require("./routes/user/index.routes");
app.use(cors("*"));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  console.log("HTTP method is " + req.method + ", URL -" + req.url);
  next(); // Proceed to the next middleware or route handler
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use("/api/v1/user", Auth);
app.use("/api/v1/user", ReviewAndWishList);
app.use("/api/v1/user", View);
app.use("/api/v1/user", Address);
app.use("/api/v1/user", Cart);
app.use("/api/v1/user", Order);
app.use("/api/v1/user", Service);
app.use("/api/v1/user", Payment); 
app.use("/api/v1/user", Event);
app.use("/api/v1/user", Career);
app.use("/api/v1/user", Track);
app.use("/api/v1/user", Barn);
app.use("/api/v1/user", Member);
app.use("/api/v1/user", Chat);
app.use("/api/v1/user", RentalProduct);
app.use("/api/v1/user", SubScription);
app.use("/api/v1/user", FedexIntegration);

orderCleanupJob();

app.listen(process.env.USER_PORT, () => {
  console.log(`User server is running on PORT: ${process.env.USER_PORT}`);
});
