// let { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
// let { writeFileSync, readFileSync } = require("fs");
// const { s3 } = require("../../configs/aws.config");
// const { AWS_S3_BUCKET_NAME, AWS_URL } = require("../../configs/server.config");
// const { randomString } = require("./common.utils");
// module.exports = productInvoice = async (
//   invoiceNumber,
//   invoiceDate,
//   name,
//   address,
//   location,
//   contact,
//   paymentId,
//   userId,
//   texPrice,
//   discount,
//   subTotal,
//   total,
//   quantity,
//   paymentType,
// ) => {
//   try {
//     console.log("dsgaga",
//       invoiceNumber,
//       invoiceDate,
//       name,
//       address,
//       location,
//       contact,
//       paymentId,
//       userId,
//       texPrice,
//       discount,
//       subTotal,
//       total,
//       quantity,
//       paymentType);


//     let rString=await randomString(5);
//     let document = await PDFDocument.load(
//       readFileSync("pdf/barnConnectRead.pdf")
//     );
//     let helveticaFont = await document.embedFont(StandardFonts.Helvetica);
//     let helveticaBoldFont = await document.embedFont(
//       StandardFonts.HelveticaBold
//     );
//     const firstPage = document.getPage(0);
//     let { width, height } = firstPage.getSize();
//     console.log("f",width, height)

//     firstPage.drawText("invoice" + invoiceNumber.toString(), {
//       x: 300,
//       y: height / 2 + 260,
//       size: 12,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText("Issue Date : " + invoiceDate.toString(), {
//       x: 330,
//       y: height / 2 + 240,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText("Payment ID:", {
//       x: 330,
//       y: height / 2 + 220,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(paymentId.toString(), {
//       x: 425,
//       y: height / 2 + 220,
//       size: 13,
//       font: helveticaFont,
//     });

//     firstPage.drawText("Customer ID:", {
//       x: 330,
//       y: height / 2 + 180,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(userId.toString(), {
//       x: 430,
//       y: height / 2 + 180,
//       size: 13,
//       font: helveticaFont,
//     });
//     firstPage.drawText("Discount :", {
//       x: 330,
//       y: height / 2 + 160,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(discount.toString(), {
//       x: 430,
//       y: height / 2 + 160,
//       size: 13,
//       font: helveticaFont,
//     });

//     //************* LEFT  Billing *************
//     firstPage.drawText("Billing To :", {
//       x: 40,
//       y: height / 2 + 240,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(name.toString(), {
//       x: 120,
//       y: height / 2 + 240,
//       size: 13,
//       font: helveticaFont,
//     });
//     let y2 = 240;
//     let a = address.toString();
//     let st = a
//       .split(/((?:\w+ ){5})/g)
//       .filter(Boolean)
//       .join("\n");
//     let s = st.split(/\r?\n|\r|\n/g);
//     for (let i = 0; i < s.length; i++) {
//       y2 = y2 - 20;
//       firstPage.drawText(s[i], {
//         x: 40,
//         y: height / 2 + y2,
//         size: 13,
//         font: helveticaFont,
//       });
//     }
//     // firstPage.drawText(address.toString(), {
//     //   x: 180,
//     //   y: height / 2 + 930,
//     //   size: 50,
//     //   font: helveticaBoldFont,
//     // });
//     // y2 = y2 - 20;
//     // firstPage.drawText(location.toString(), {
//     //   x: 40,
//     //   y: height / 2 + y2,
//     //   size: 13,
//     //   font: helveticaFont,
//     // });
//     y2 = y2 - 20;
//     firstPage.drawText("Contact :", {
//       x: 40,
//       y: height / 2 + y2,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(contact.toString(), {
//       x: 120,
//       y: height / 2 + y2,
//       size: 13,
//       font: helveticaFont,
//     });
//     y2 = y2 - 20;

//     // ****************  INVOICE DATE *******************
//     y2 = y2 - 60;
//     firstPage.drawText("Invoice Date :", {
//       x: 30,
//       y: height / 2 + y2,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(invoiceDate.toString(), {
//       x: 130,
//       y: height / 2 + y2,
//       size: 13,
//       font: helveticaFont,
//     });
//     firstPage.drawText("Paid On :", {
//       x: 210,
//       y: height / 2 + y2,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(invoiceDate.toString(), {
//       x: 280,
//       y: height / 2 + y2,
//       size: 13,
//       font: helveticaFont,
//     });
//     firstPage.drawText("Payment Terms : ", {
//       x: 360,
//       y: height / 2 + y2,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(paymentType.toString(), {
//       x: 490,
//       y: height / 2 + y2,
//       size: 13,
//       font: helveticaFont,
//     });

//     //  ******************** PRODUCT DETAILS ********************************
//     let y = 60;
//     // for (let i = 0; i < serviceAll.length; i++) {
//     y = y - 31;
//     let sno = 1;
//     sno = sno.toString();
//     firstPage.drawText(sno, {
//       x: 50,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaBoldFont,
//     });

//     firstPage.drawText(quantity.toString(), {
//       x: 290,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaFont,
//     });
//     firstPage.drawText(total.toString(), {
//       x: 510,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaFont,
//     });
//     y = y - 31;
//     firstPage.drawText("Discount:", {
//       x: 370,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(discount.toString(), {
//       x: 510,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaFont,
//     });
//     y = y - 31;
//     firstPage.drawText("Subtotal:", {
//       x: 370,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText(subTotal.toString(), {
//       x: 510,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaFont,
//     });

//     y = y - 31;
//     firstPage.drawText("Sub Total :", {
//       x: 370,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     firstPage.drawText("$. " + subTotal.toString(), {
//       x: 480,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaBoldFont,
//     });
//     y = y - 20;
//     // firstPage.drawText("Total :", {
//     //   x: 370,
//     //   y: height / 2 + y,
//     //   size: 15,
//     //   font: helveticaBoldFont,
//     // });
    
//     firstPage.drawText("$. " + total.toString(), {
//       x: 480,
//       y: height / 2 + y,
//       size: 15,
//       font: helveticaBoldFont,
//     });

//     // BILL INFORMATION
//     firstPage.drawText("Bill Information :", {
//       x: 40,
//       y: height / 2 - 300,
//       size: 15,
//       font: helveticaBoldFont,
//     });

//     //write pdf
//     writeFileSync("pdf/barnConnectWrite.pdf", await document.save());
//     let fileContent = readFileSync("pdf/barnConnectWrite.pdf");
//     let fileLocation = "invoices/" + rString + "_" + userId + ".pdf";
//     var params = {
//       Bucket: AWS_S3_BUCKET_NAME,
//       Key: fileLocation,
//       Body: fileContent,
//       ContentType: "application/pdf",
//       ACL: "public-read",
//     };
//     await s3.upload(params).promise();
//     console.log("dsgaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//     let urlFile = AWS_URL + fileLocation;
//     console.log(urlFile);
//     return urlFile;
//   } catch (err) {
//     return false;
//   }
// };



const { PDFDocument, StandardFonts } = require("pdf-lib");
const { writeFileSync, readFileSync } = require("fs");
const AWS = require("aws-sdk");

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS access key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS secret access key
  region: process.env.AWS_REGION // Your AWS region
});

const AWS_S3_BUCKET_NAME = "your-s3-bucket-name"; // Your S3 bucket name
const AWS_URL = "https://your-s3-bucket-name.s3.amazonaws.com/"; // URL to access your S3 bucket

// Random string generation function
const randomString = async (length) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = productInvoice = async (
  invoiceNumber,
  invoiceDate,
  name,
  address,
  location,
  contact,
  paymentId,
  userId,
  itemDescription,
  quantity,
  rate,
  taxRate,
  discount,
  subTotal,
  total,
  paymentType
) => {
  try {
    // Generate a random string for the invoice file name
    const rString = await randomString(5);

    // Load the existing PDF template
    const document = await PDFDocument.load(readFileSync("pdf/barnConnectRead.pdf"));
    
    // Embed fonts
    const helveticaFont = await document.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await document.embedFont(StandardFonts.HelveticaBold);
    
    // Get the first page of the document
    const firstPage = document.getPage(0);
    const { height } = firstPage.getSize();

    // Populate Invoice Number and Date
    firstPage.drawText(invoiceNumber, {
      x: 150, // X coordinate for "Invoice Number"
      y: height - 120, // Y coordinate for "Invoice Number"
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText(invoiceDate, {
      x: 150, // X coordinate for "Invoice Date"
      y: height - 140, // Y coordinate for "Invoice Date"
      size: 12,
      font: helveticaFont,
    });

    // Populate Bill To
    firstPage.drawText("Bill To:", {
      x: 50, // X coordinate for "Bill To"
      y: height - 180, // Y coordinate for "Bill To"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(name, {
      x: 50, // X coordinate for the name
      y: height - 200, // Y coordinate for the name
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText(address, {
      x: 50, // X coordinate for the address
      y: height - 220, // Y coordinate for the address
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText(location, {
      x: 50, // X coordinate for the location
      y: height - 240, // Y coordinate for the location
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText(contact, {
      x: 50, // X coordinate for the contact
      y: height - 260, // Y coordinate for the contact
      size: 12,
      font: helveticaFont,
    });

    // Populate Ship To (assuming same as Bill To for now, adjust as needed)
    firstPage.drawText({
      x: 350, // X coordinate for "Ship To"
      y: height - 180, // Y coordinate for "Ship To"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(name, {
      x: 350, // X coordinate for the name
      y: height - 200, // Y coordinate for the name
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText(address, {
      x: 350, // X coordinate for the address
      y: height - 220, // Y coordinate for the address
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText(location, {
      x: 350, // X coordinate for the location
      y: height - 240, // Y coordinate for the location
      size: 12,
      font: helveticaFont,
    });

    // Populate Item Details
    firstPage.drawText({
      x: 50, // X coordinate for "Item Description"
      y: height - 300, // Y coordinate for "Item Description"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(itemDescription, {
      x: 50, // X coordinate for the item description
      y: height - 320, // Y coordinate for the item description
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText({
      x: 250, // X coordinate for "Quantity"
      y: height - 320, // Y coordinate for "Quantity"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(quantity.toString(), {
      x: 350, // X coordinate for quantity value
      y: height - 320, // Y coordinate for quantity value
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText({
      x: 450, // X coordinate for "Rate"
      y: height - 320, // Y coordinate for "Rate"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(`$${rate.toFixed(2)}`, {
      x: 500, // X coordinate for rate value
      y: height - 320, // Y coordinate for rate value
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText( {
      x: 600, // X coordinate for "Amount"
      y: height - 320, // Y coordinate for "Amount"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(`$${(quantity * rate).toFixed(2)}`, {
      x: 650, // X coordinate for amount value
      y: height - 320, // Y coordinate for amount value
      size: 12,
      font: helveticaFont,
    });

    // Populate Terms & Conditions
    firstPage.drawText({
      x: 50, // X coordinate for "Terms & Conditions"
      y: height - 360, // Y coordinate for "Terms & Conditions"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(`${paymentType}`, {
      x: 50,
      y: height - 380, // Adjust Y position
      size: 12,
      font: helveticaFont,
    });

    // Populate Summary
    firstPage.drawText({
      x: 450, // X coordinate for "Sub Total"
      y: height - 400, // Y coordinate for "Sub Total"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(`$${subTotal.toFixed(2)}`, {
      x: 550, // X coordinate for sub total value
      y: height - 400, // Y coordinate for sub total value
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText({
      x: 450, // X coordinate for "Tax Rate"
      y: height - 420, // Y coordinate for "Tax Rate"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(`${taxRate.toFixed(2)}%`, {
      x: 550, // X coordinate for tax rate value
      y: height - 420, // Y coordinate for tax rate value
      size: 12,
      font: helveticaFont,
    });

    firstPage.drawText({
      x: 450, // X coordinate for "Total"
      y: height - 440, // Y coordinate for "Total"
      size: 12,
      font: helveticaBoldFont,
    });

    firstPage.drawText(`$${total.toFixed(2)}`, {
      x: 550, // X coordinate for total value
      y: height - 440, // Y coordinate for total value
      size: 12,
      font: helveticaFont,
    });

    // Save the modified PDF locally
    const pdfPath = `pdf/barnConnectWrite_${rString}.pdf`;
    writeFileSync(pdfPath, await document.save());

    // Upload the modified PDF to S3
    const fileContent = readFileSync(pdfPath);
    const fileLocation = `invoices/${rString}_${userId}.pdf`;
    const params = {
      Bucket: AWS_S3_BUCKET_NAME,
      Key: fileLocation,
      Body: fileContent,
      ContentType: "application/pdf",
      ACL: "public-read",
    };

    await s3.upload(params).promise();

    // Return the URL of the uploaded PDF
    const urlFile = AWS_URL + fileLocation;
    return urlFile;

  } catch (err) {
    console.error(err);
    return false;
  }
}