const express = require("express");
const multer = require("multer");
const ListingController = require("../Controllers/ListingController");
const validateRequest = require("../middelware/validation/validateRequest");
const { upload } = require("../middelware/upload");
const { 
  createListingSchema, 
  filterListingSchema, 
  idParamSchema 
} = require("../middelware/validation/listingSchemas");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { optionalAuth } = require("../middelware/optionalAuth");
const createListingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 listing creations per windowMs
  message: {
    success: false,
    message: "Too many listing creations, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false
});



router.post(
  "/create",
  createListingLimiter,
  upload.array("files", 10),
  (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "File too large. Maximum size is 10MB." });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({ success: false, message: "Too many files. Maximum is 10 files." });
      }
    }
    next(err);
  },
  validateRequest(createListingSchema),
  ListingController.createListing
);

router.get(
  "/find/:id",
  validateRequest(idParamSchema, 'params'),
   optionalAuth("user_token_realEstate"),
  ListingController.getListingById
);

router.get(
  "/results/filters",
   optionalAuth("user_token_realEstate"),
  validateRequest(filterListingSchema, 'query'),
  ListingController.getListingByFilter
);

router.delete("/delete", ListingController.deleteAllListings)

module.exports = router;