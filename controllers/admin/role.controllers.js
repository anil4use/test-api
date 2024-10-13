const roleService=require("../../services/admin/role.services")
class RoleController{
  async addRole(req,res){
    try {
        const result = await roleService.addRoleService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }

  async updateRole(req,res){
    try {
        const result = await roleService.updateRoleService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }

  async deleteRole(req,res){
    try {
        const result = await roleService.deleteRoleService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }

  async getAllRole(req,res){
    try {
        const result = await roleService.getAllRoleService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }

  async getRoleById(req,res){
    try {
        const result = await roleService.getRoleByIdService(req, res);
        return result;
      } catch (error) {
        throw error;
      }
  }
}
module.exports=new RoleController();