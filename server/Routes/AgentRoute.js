const express = require("express");
const multer = require("multer");
const { getAgents, getAgentByAgentId, getAgentContactInfo } = require("../Controllers/AgentController");
const router = express();
router.get("/agents", getAgents)
router.get("/agent/:agentId", getAgentByAgentId)
router.get("/agent/contact/:agentId", getAgentContactInfo)
module.exports = router