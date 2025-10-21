const express = require("express");
const { isAuthenticated, authorizeRoles } = require('../../middelware/auth');
const { getAnalytics } = require("../../Controllers/Dashboard/DashboardAnalyticsController");
const router = express();
router.get("/analytics", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), getAnalytics);
module.exports = router