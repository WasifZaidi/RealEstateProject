const express = require("express");
const { isAuthenticated, authorizeRoles } = require('../../middelware/auth');
const { getAgentMeetings } = require("../../Controllers/Dashboard/DashboardMeetingController");
const router = express();
router.post("/agent/meetings", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), getAgentMeetings);
module.exports = router