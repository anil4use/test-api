const adminService = require("../../services/admin/admin.services");
class AdminController {


  async addAdmin(req, res) {
    try {
      const result = await adminService.addAdminService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async updateAdmin(req, res) {
    try {
      const result = await adminService.updateAdminService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async deleteAdminById(req, res) {
    try {
      const result = await adminService.deleteAdminByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAdminById(req, res) {
    try {
      const result = await adminService.getAdminByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
  async getAllAdmins(req, res) {
    try {
      const result = await adminService.getAllAdminsService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  ///role
  async addRole(req, res) {
    try {
      const result = await adminService.deleteAdminByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //updateRole

  async updateRole(req, res) {
    try {
      const result = await adminService.deleteAdminByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //deleteRole
  async deleteRole(req, res) {
    try {
      const result = await adminService.deleteAdminByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getAllRole
  async getAllRole(req, res) {
    try {
      const result = await adminService.deleteAdminByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  //getRoleById
  async getAllRole(req, res) {
    try {
      const result = await adminService.deleteAdminByIdService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new AdminController();
