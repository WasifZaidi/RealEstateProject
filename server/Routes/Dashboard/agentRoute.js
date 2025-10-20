const express = require("express");
const { isAuthenticated, authorizeRoles } = require('../../middelware/auth');
const { upload } = require("../../middelware/upload");
const { createAgent, getAgentByUser, updateAgent } = require("../../Controllers/Dashboard/DashboardAgentController");
const router = express();
router.post("/agent/create", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), upload.single("file"), createAgent);
router.get("/agent/myProfile", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), getAgentByUser)
router.put("/agent/updateProfile",  isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), upload.single("file"), updateAgent )
module.exports = router