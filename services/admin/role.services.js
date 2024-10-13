const log = require("../../configs/logger.config");
const roleDao = require("../../daos/role.dao");
class RoleService {
  async addRoleService(req, res) {
    try {
      const adminId = req.userId;
      const { name, isActive, permission } = req.body;
      console.log(adminId,name,isActive,permission)
      if (!adminId || !name  || !Array.isArray(permission)) {
        log.error("Error from [ROLE SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }
      
      const isExist = await roleDao.getRoleByName(name);
      if (isExist.data) {
        return res.status(400).json({
          message: "role already exist",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const data = {
        name,
        isActive,
        permission,
      };

      console.log(data);

      const result = await roleDao.addRole(data);
      if (result.data) {
        return res.status(200).json({
          message: "role created successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "role creation failed",
          success: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ADD ROLE SERVICE]: ", error);
      throw error;
    }
  }
  async updateRoleService(req, res) {
    try {
      const adminId = req.userId;
      const { roleId, name, isActive, permission } = req.body;

      if (!adminId || !roleId) {
        log.error("Error from [ROLE SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const isExist = await roleDao.getRoleById(roleId);

      if (!isExist.data) {
        return res.status(201).json({
          message: "role not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const data = {
        name,
        isActive,
        permission,
      };
      const result = await roleDao.updateRoleById(roleId,data);
      if (result.data) {
        return res.status(200).json({
          message: "role updated successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "role update failed",
          success: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ADD ROLE SERVICE]: ", error);
      throw error;
    }
  }
  //getRoleByIdService
  async getRoleByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { roleId } = req.body;
      if (!adminId || !roleId) {
        log.error("Error from [ROLE SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const result = await roleDao.getRoleById(roleId);
      if (result.data) {
        return res.status(200).json({
          message: "role get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "role not found",
          success: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ROLE SERVICE]: ", error);
      throw error;
    }
  }
  //deleteRoleService
  async deleteRoleService(req, res) {
    try {
      const adminId = req.userId;
      const { roleId } = req.body;
      if (!adminId || !roleId) {
        log.error("Error from [ROLE SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const isExist = await roleDao.getRoleById(roleId);
      if (!isExist.data) {
        return res.status(200).json({
          message: "role not found",
          success: "fail",
          code: 200,
          data: null,
        });
      }

      const result = await roleDao.deleteRoleById(roleId);

      if (result.data) {
        return res.status(200).json({
          message: "role deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "role deletion fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [ROLE SERVICE]: ", error);
      throw error;
    }
  }

  //getAllRoleService
  async getAllRoleService(req, res) {
    try {
      const adminId = req.userId;
   
      if (!adminId) {
        log.error("Error from [ROLE SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      const result = await roleDao.getAllRole();
      if (result.data) {
        return res.status(200).json({
          message: "roles get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "roles not found",
          success: "failed",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [ROLE SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new RoleService();
