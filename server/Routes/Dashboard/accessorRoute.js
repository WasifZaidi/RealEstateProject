const express = require("express");
const { dashboardLogin, getUsersWithFilter, updateUserRole, deleteUser, dashboardlogout } = require("../../Controllers/Dashboard/DashboardUserController");
const { isAuthenticated, authorizeRoles } = require('../../middelware/auth');
const { getLoggedInUser } = require("../../Controllers/UserController");
const router = express();
router.post("/signIn", dashboardLogin);
router.post("/logout", dashboardlogout);
router.get("/users", isAuthenticated("access_token_realEstate"),  authorizeRoles("admin", "manager"), getUsersWithFilter);
router.put('/role/:id', isAuthenticated("access_token_realEstate"),  authorizeRoles("admin", "manager"), updateUserRole )
router.get("/accessor", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), getLoggedInUser)
router.delete(
  "/users/:id",
  isAuthenticated("access_token_realEstate"),
  authorizeRoles("admin", "manager"),
  deleteUser
);

module.exports = router