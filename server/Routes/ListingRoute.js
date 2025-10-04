const express = require("express");
const multer = require("multer");
const ListingController = require("../Controllers/ListingController");

const router = express.Router();

// Configure Multer storage (temporary, before cloudinary upload)
const upload = multer({ dest: "uploads/" }); // or memoryStorage()

router.post(
  "/create",
  upload.array("files"), // must match field name in FormData
  ListingController.createListing
);

router.get(
  "/find/:id",
  ListingController.getListingById
)

module.exports = router;
