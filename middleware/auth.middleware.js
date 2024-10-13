const userDao = require("../daos/user.dao");
const adminDao = require("../daos/admin.dao");
const { verifyToken } = require("../utils/helpers/token.utils");
const { headerDecode } = require("../utils/helpers/validator.utils");
const log = require("../configs/logger.config");
const Authkey = process.env.API_MESSAGE;

class JWT {
  async authkey(req, res, next) {
    try {
      const authKey = req.headers.authkey;
      const decodeOuth = headerDecode(authKey);
      if (Authkey === decodeOuth) {
        req.headers.authkey = decodeOuth;
        log.info("user authenticated successfully");
        next();
      } else {
        return res.status(400).json({
          message: "Unauthorized",
          status: "failed",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("Error from [Auth MiddleWare]: ", error);
      return res.status(400).json({
        message: "Unauthorized",
        status: "failed",
        data: null,
        code: 201,
      });
    }
  }

  async authenticateJWT(req, res, next) {
    try {
      const authKey = req.headers.authkey;
      const decodeOuth = headerDecode(authKey);
      const authHeader = req.headers.authorization;
      if (Authkey !== decodeOuth) {
        return res.status(400).json({
          message: "access Denied",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      if (!authHeader || authHeader === null) {
        log.error("Error from [Auth MIDDLEWARE]: Invalid authentication token");
        return res.status(403).json({
          message: "access Denied",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      const token = authHeader.split(" ")[1];
      const payload = verifyToken(token);

      if (!payload) {
        log.error("Error from [Auth MIDDLEWARE]: Unauthorized token");
        return res.status(403).json({
          message: "Unauthorized",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      req.userId = payload.userId;

      let user;
      if (payload.type === "Admin") {
        user = await adminDao.getById(req.userId);
      } else {
        user = await userDao.getUserById(req.userId);
      }

      if (user && user.data && user.code !== 201) {
        log.info("Authentication token verified");
        next();
      } else {
        log.error("Error from [Auth MIDDLEWARE]: User or Admin not found");
        return res.status(403).json({
          message: "Unauthorized",
          status: "failed",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("Error from [Auth MIDDLEWARE]: ", error);
      return res.status(400).json({
        message: "Unauthorized",
        status: "failed",
        data: null,
        code: 201,
      });
    }
  }
}
module.exports = new JWT();
