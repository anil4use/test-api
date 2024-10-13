const express = require("express");
const app = express();
const cookieSession = require("cookie-session");
require("dotenv").config();
const cors = require("cors");
const ejs = require('ejs');
const path = require('path');
require("./configs/db.config");
const {
  Auth,
  User,
  Product,
  Admin,
  Barn,
  Service,
  SubCategory,
  Category,
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
} = require("./routes/admin/index.routes");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = process.env.ADMIN_PORT;

app.use(
  cookieSession({
    name: "session",
    keys: ["barnConnect", "session", "backend"],
    maxAge: 24 * 60 * 60 * 100,
  })
);  
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));


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

app.use("/api/v1", Auth);
app.use("/api/v1", User);
app.use("/api/v1", Admin);
app.use("/api/v1", StaffAndRole);
app.use("/api/v1", Barn);
app.use("/api/v1", Product);
app.use("/api/v1", Category);
app.use("/api/v1", SubCategory);
app.use("/api/v1", Service);
app.use("/api/v1", ServiceCategory);
app.use("/api/v1",Coupons);
app.use("/api/v1",Dashboard);
app.use("/api/v1",Career);
app.use("/api/v1",CareerCategory);
app.use("/api/v1",TransactionHistory);
app.use("/api/v1",AdsCampaign);
app.use("/api/v1",Subscription);
app.use("/api/v1",Event);
app.listen(port, () => {
  console.log(`admin server is running on PORT: ${port}`);
});
