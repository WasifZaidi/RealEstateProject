const express = require("express");
const multer = require("multer");
const { getAgents, getAgentByAgentId } = require("../Controllers/AgentController");
const router = express();
router.get("/agents", getAgents)
router.get("/agent/:agentId", getAgentByAgentId)
module.exports = router