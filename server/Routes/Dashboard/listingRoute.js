const express = require("express");
const { isAuthenticated, authorizeRoles } = require('../../middelware/auth');
const {getAgentListings} = require("../../Controllers/ListingController")
const {getListingById, updateListing, deleteListing} = require("../../Controllers/Dashboard/DashboardListingController")
const validateRequest = require("../../middelware/validation/validateRequest")
const { upload } = require("../../middelware/upload")
const router = express();
const rateLimit = require("express-rate-limit");
const { createListingSchema } = require("../../middelware/validation/listingSchemas");
const Joi = require('joi');
const createListingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 5 listing creations per windowMs
  message: {
    success: false,
    message: "Too many listing creations, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.get("/listings/agent", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), getAgentListings );
router.get("/dashboard/getListing/:id",  isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), getListingById)
router.post(
  "/update/:id",
  createListingLimiter,
  upload.array("newFiles", 10),
  (err, req, res, next) => {
    next(err);
  },
  validateRequest(createListingSchema.keys({
    removedMediaIds: Joi.string().optional(),
    mediaOrder: Joi.string().optional(),
    coverMediaPublicId: Joi.string().optional(),
    mediaTempIds: Joi.string().optional(), 
  })), 
  updateListing 
);
router.delete("/dashboard/listing/:listingId", isAuthenticated("access_token_realEstate"), authorizeRoles("admin", "manager", "agent"), deleteListing)
module.exports = router