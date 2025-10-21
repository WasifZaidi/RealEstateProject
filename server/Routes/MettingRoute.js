const express = require("express");
const { createTour, getAgentMeetingDates, getMeetingById, cancelTour, rescheduleMeetingOrTour } = require("../Controllers/MeetingController.js");
const { isAuthenticated, authorizeRoles } = require("../middelware/auth");
const router = express();
router.post("/tour", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), createTour)
router.get("/meetings/:agentId", isAuthenticated("user_token_realEstate"), getAgentMeetingDates)
router.get("/meeting/:meetingId", isAuthenticated("user_token_realEstate"), getMeetingById)
router.post("/cancelMeeting/:meetingId", isAuthenticated("user_token_realEstate"), cancelTour)
router.put("/rescheduleMeetingOrTour/:meetingId", isAuthenticated("user_token_realEstate"), rescheduleMeetingOrTour)
module.exports = router