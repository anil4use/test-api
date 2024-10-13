require("dotenv").config();
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_ACCOUNT_AUTH_TOKEN,
} = require("../../configs/server.config");
const twilio = require("twilio");
const twilioOTPService = async (contact,otp) => {
  console.log(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH_TOKEN);

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_ACCOUNT_AUTH_TOKEN);
  const message = await client.messages.create({
    body: `OTP for login at Barn Connect is ${otp}. it will be valid only for 30s`,
    from: contact.toString(),
    to: TWILIO_ACCOUNT_PHONENUMBER,
  });
  return message.sid;
};

module.exports = {
  twilioOTPService,
};
