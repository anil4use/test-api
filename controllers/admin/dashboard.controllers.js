const dashboardService = require("../../services/admin/dashboard.services");
class DashboardController {
  async dashboard(req, res) {
    try {
      const result = await dashboardService.dashboardService(req, res);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new DashboardController();
