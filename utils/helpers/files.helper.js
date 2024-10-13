const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../../configs/aws.config");
const { AWS_S3_BUCKET_NAME, AWS_URL } = require("../../configs/server.config");

//upload barn
const uploadBarnImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = "barn/" + newFileName;
      cb(null, fullPath);
    },
  }),
});
//uploadHorseImages
const uploadHorseImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = "horse/" + newFileName;
      cb(null, fullPath);
    },
  }),
});

//upload service image
const uploadServiceImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = "service/" + newFileName;
      cb(null, fullPath);
    },
  }),
});

//uploadCategoryImage
const uploadCategoryImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = "category/" + newFileName;
      cb(null, fullPath);
    },
  }),
});

//uploadSubCategoryImage
const uploadSubCategoryImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = "subCategory/" + newFileName;
      cb(null, fullPath);
    },
  }),
});

//uploadProductImages
const uploadProductImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = "product/" + newFileName;
      cb(null, fullPath);
    },
  }),
});

//uploadServiceCategoryImage
const uploadServiceCategoryImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = "serviceCategory/" + newFileName;
      cb(null, fullPath);
    },
  }),
});

//uploadApplicantResume
const uploadApplicantResume = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = "applicantDetails/" + newFileName;
      cb(null, fullPath);
    },
  }),
});


//chatImages
const uploadChatImages = multer({
  storage: multerS3({
    s3: s3,
    bucket: AWS_S3_BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const newFileName = Date.now() + file.originalname.replace(/\s+/g, "_");
      const fullPath = "chatImages/" + newFileName;
      cb(null, fullPath);
    },
  }),
});


const deleteS3Object = async (url) => {
  try {
    if (typeof url === "string") {
      console.log(url.replace(AWS_URL, ""));

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: url.replace(AWS_URL, ""),
      };

      s3.deleteObject(params, (err, data) => {
        if (err) {
          console.error("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    } else {
      console.error("URL is not a string:", url);
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  uploadBarnImages,
  uploadServiceImages,
  uploadCategoryImage,
  uploadProductImages,
  uploadSubCategoryImage,
  uploadServiceCategoryImage,
  deleteS3Object,
  uploadApplicantResume,
  uploadChatImages,
  uploadHorseImages
};
