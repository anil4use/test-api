require("dotenv").config();
const mongoose = require("mongoose");
// const staffModel = require("../models/staff.model");
const counterModel = require("../models/counter.model");
const roleModel = require("../models/staff/roles.model");
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const url = MONGO_URI + "/" + DB_NAME;

const connectDataBase = async () => {
  try {
    mongoose
      .connect(url)
      .then(() => {
        let data = {
          roleId: "BCR_1",
          name: "Admin",
          permission: [
            {
              module: "Product",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            {
              module: "Category",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            {
              module: "Subcategory",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            {
              module: "Barn",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            {
              module: "Service",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            {
              module: "ServiceCategory",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            {
              module: "Order",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            {
              module: "Staff",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            {
              module: "Coupon",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
            {
              module: "User",
              create: true,
              read: true,
              update: true,
              delete: true,
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        let staff = {
          _id: "Role",
          seq: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        new counterModel(staff).save();
        console.log("counter seeding done.");

        new roleModel(data).save();
        console.log("admin seeding done.");
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error("Error connecting to the database:", err);
  }
};
connectDataBase();
