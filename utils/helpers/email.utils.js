// const log = require("../../configs/logger.config");
// const {
//   MAIL_NOREPLAY,
//   MAIL_HOST,
//   MAIL_PORT,
//   MAIL_USERNAME,
//   MAIL_PASSWORD,
//   BASE_URL,
// } = require("../../configs/server.config");
// const nodemailer = require("nodemailer");
// const senderEmail = MAIL_NOREPLAY;
// const sendMail = async (options) => {
//   console.log(
//     MAIL_NOREPLAY,
//     MAIL_HOST,
//     MAIL_PORT,
//     MAIL_USERNAME,
//     MAIL_PASSWORD
//   );

//   try {
//     let message;
//     let transport = nodemailer.createTransport({
//       host: MAIL_HOST,
//       port: MAIL_PORT,
//       secure: true,
//       service: "Gmail",
//       auth: {
//         user: MAIL_USERNAME,
//         pass: MAIL_PASSWORD,
//       },
//     });

//     const { email, subject, emailData, emailType } = options;
//     let bodyData = "";

//     if (emailType === "job") {
//       bodyData =
//         "We would like to acknowledge that we have received your application Our HR representative will review your application and send you a response shortly Thank you for your patience.";
//     } else if (emailType === "verify") {
//       const verificationLink = `${BASE_URL}/verify-account?token=${emailData.verificationToken}`;
//       bodyData = `Please verify your email by clicking on the following link: ${verificationLink}`;
//     } else {
//       bodyData = `Your OTP/Password is ${emailData.otp}`;
//     }
//     message = await transport.sendMail({
//       from: senderEmail,
//       to: email,
//       subject: subject,
//       text: bodyData,
//     });
//   } catch (err) {
//     return false;
//   }
// };

// module.exports = {
//   sendMail,
// };

const log = require("../../configs/logger.config");
const {
  MAIL_NOREPLAY,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USERNAME,
  MAIL_PASSWORD,
  BASE_URL,
} = require("../../configs/server.config");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const senderEmail = MAIL_NOREPLAY;

const sendMail = async (options) => {
  console.log(
    MAIL_NOREPLAY,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD
  );

  try {
    let transport = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: true,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });

    const { email, subject, emailData, emailType } = options;
    let htmlContent;
    // Set template file path
    const templatePath = path.join(__dirname, "../../view");

    // Choose template based on email type
    switch (emailType) {
      case "job":
        htmlContent = await ejs.renderFile(path.join(templatePath, "job.ejs"), {
          name: emailData.name,
        });
        break;
      case "verify":
        const verificationLink = `${BASE_URL}/verify-code?token=${emailData.verificationToken}`;
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "verify.ejs"),
          {
            verificationLink,
          }
        );
        break;
      //product category
      case "productCategoryRequest":
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "productCategoryRequest.ejs"),
          {
            name: emailData.name,
          }
        );
        break;

      case "productCategoryAccept":
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "productCategoryAccept.ejs"),
          {
            name: emailData.name,
          }
        );
        break;
      case "productCategoryCancel":
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "productCategoryCancel.ejs"),
          {
            name: emailData.name,
          }
        );
        break;
      //productSubCategory
      case "productSubCategoryRequest":
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "productSubCategoryRequest.ejs"),
          {
            name: emailData.name,
          }
        );
        break;

      case "productSubCategoryAccept":
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "productSubCategoryAccept.ejs"),
          {
            name: emailData.name,
          }
        );
        break;
      case "productSubCategoryCancel":
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "productSubCategoryAccept.ejs"),
          {
            name: emailData.name,
          }
        );
        break;
      //job category
      case "jobCategoryRequest":
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "jobCategoryRequest.ejs"),
          {
            name: emailData.name,
          }
        );
        break;

      case "jobCategoryAccept":
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "jobCategoryAccept.ejs"),
          {
            name: emailData.name,
          }
        );
        break;
      case "jobCategoryCancel":
        htmlContent = await ejs.renderFile(
          path.join(templatePath, "jobCategoryCancel.ejs"),
          {
            name: emailData.name,
          }
        );
        break;
      case "otp":
      default:
        htmlContent = await ejs.renderFile(path.join(templatePath, "otp.ejs"), {
          otp: emailData.otp,
        });
        break;
    }

    // Send email
    await transport.sendMail({
      from: senderEmail,
      to: email,
      subject: subject,
      html: htmlContent,
    });
  } catch (err) {
    log.error("Error sending email:", err);
    return false;
  }
};

module.exports = {
  sendMail,
};
