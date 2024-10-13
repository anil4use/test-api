const staffService= require("../../services/admin/staff.services");
class StaffController{
  async addStaff(req,res){
    try {
        const result = await staffService.addStaffService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }

  async updateStaff(req,res){
    try {
        const result = await staffService.updateStaffService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }

  async deleteStaff(req,res){
    try {
        const result = await staffService.deleteStaffService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }

  async getAllStaff(req,res){
    try {
        const result = await staffService.getAllStaffService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }

  async getStaffById(req,res){
    try {
        const result = await staffService.getStaffByIdService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }

  async getStaffPermission(req,res){
    try {
        const result = await staffService.getStaffPermissionService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }
}

module.exports=new StaffController();