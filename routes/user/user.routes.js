const express = require("express");
const router = express.Router();
const JWT = require("../../middleware/auth.middleware");
const log = require("../../configs/logger.config");
const UserController = require("../../controllers/user/user.controllers");
const { uploadHorseImages } = require("../../utils/helpers/files.helper");

router.route("/signUp").post(express.json(), JWT.authkey, async (req, res) => {
  try {
    const result = await UserController.register(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router
  .route("/verifyToken")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await UserController.verifyToken(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.route("/login").post(express.json(), JWT.authkey, async (req, res) => {
  try {
    const result = await UserController.login(req, res);
    return result;
  } catch (error) {
    log.error("Internal Server Error : ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router
  .route("/forgetPassword")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await UserController.forgetPassword(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/verifyOtp")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await UserController.verifyOtp(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/reSendOtp")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await UserController.reSendOtp(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/setPassword")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await UserController.setNewPassword(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

//update Profile

router
  .route("/editProfile")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await UserController.editProfile(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getUserDetail")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await UserController.getUserDetail(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/socialLogin")
  .post(express.json(), JWT.authkey, async (req, res) => {
    try {
      const result = await UserController.socialLogin(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.route("/horseProfile").post(
  express.json(),
  JWT.authenticateJWT,
  uploadHorseImages.fields([
    { name: "docs", maxCount: 10 },
    { name: "images", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const result = await UserController.horseProfile(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.route("/horseProfileUpdate").post(
  express.json(),
  JWT.authenticateJWT,
  uploadHorseImages.fields([
    { name: "docs", maxCount: 10 },
    { name: "images", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const result = await UserController.horseProfileUpdate(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router
  .route("/deleteHorse")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await UserController.deleteHorse(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

router
  .route("/getHorseById")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await UserController.getHorseById(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router
  .route("/getAllHorseOfUser")
  .post(express.json(), JWT.authenticateJWT, async (req, res) => {
    try {
      const result = await UserController.getAllHorseOfUser(req, res);
      return result;
    } catch (error) {
      log.error("Internal Server Error : ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });


module.exports = router;
