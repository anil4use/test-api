const { devLogger} = require("../utils/helpers/logger.utils");

let log = null;

if (process.env.NODE_ENV === "development") {
  log = devLogger();
  global.log = log;
}

module.exports = log;
