const  counter = require("../../models/counter.model");
const log = require("../../configs/logger.config");

const getNextSequenceValue = async (type) => {
  try {
    const data = await counter.find({ _id: type });
    if (data.length == 0) {
      const res = new counter({ _id: type });
      const seq = await res.save();
      return seq.seq;
    }
    const res = await counter
      .findByIdAndUpdate(
        type,
        { $inc: { seq: 1 } },
        {
          new: true,
          upsert: true,
        }
      )
      .exec();
    return res.seq;
  } catch (error){
    log.error("Error from [COUNTER HELPER] : ", error);
    throw error;
  }
};

module.exports = getNextSequenceValue;