const bcrypt = require("bcryptjs");
const log = require("../../configs/logger.config");

const hashItem = async (item) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(item, salt);
  } catch (error) {
    log.error("Error from [Bcrypt HELPER]:", error);
    throw error;
  }
};

const compareItems = async (item1, item2) => {
  try {
    return bcrypt.compare(item1, item2);
  } catch (error) {
    log.error("Error from [Bcrypt HELPER]:", error);
    throw error;
  }
};

module.exports = { hashItem, compareItems };
