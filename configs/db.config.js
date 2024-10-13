const mongoose = require("mongoose");
const { MONGO_URI, DB_NAME } = require("./server.config");
const log = require("./logger.config");
// DATABASE CONNECTION VARIABLE
mongoose.set("strictQuery", false);
const Db_URL = MONGO_URI + "/" + DB_NAME;

mongoose
  .connect(Db_URL)
  .then(async () => {
    log.info("connected to database successfully");
  })
  .catch((err) => log.error(err));
