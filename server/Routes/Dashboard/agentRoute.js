const express = require("express");
const { createAgent } = require("../../Controllers/AgentController");
const { isAuthenticated, authorizeRoles } = require('../../middelware/auth');
const upload = require("../../middelware/upload");
const router = express();
router.post("/agent/create", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), upload.single("file"), createAgent);
module.exports = router