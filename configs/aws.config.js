const AWS = require("aws-sdk");
const {
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID,
} = require("./server.config");

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const sns = new AWS.SNS();
const s3 = new AWS.S3();

module.exports = { sns, s3 };
