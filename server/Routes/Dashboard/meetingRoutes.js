const express = require("express");
const { isAuthenticated, authorizeRoles } = require('../../middelware/auth');
const { getAgentMeetings, cancelMeeting } = require("../../Controllers/Dashboard/DashboardMeetingController");
const router = express();
router.get("/agent/meetings", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), getAgentMeetings);
router.put("/agent/meeting/cancel/:meetingId", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), cancelMeeting)
module.exports = router