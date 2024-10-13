const log = require("../../configs/logger.config");
const dashboardDao = require("../../daos/dashboard.dao");
const { validateEmail } = require("../../utils/helpers/validator.utils");

class DashboardService {
  async dashboardService(req, res) {
    try {
      const adminId = req.userId;

      const {monthName}=req.body;

      if (!adminId) {
        return res.status(400).json({
          message: "something went wrong",
          status: "success",
          code: 201,
        });
      }

      const result = await dashboardDao.dashboard(monthName);
      if (result.data) {
        return res.status(200).json({
          message: "dashboard details retrieved successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      }
    } catch (error) {
      log.error("Error from [DASHBOARD DAO] : ", error);
      throw error;
    }
  }
}

module.exports = new DashboardService();
