// middleware/upload.js
const multer = require('multer');
const path = require('path');

// ----------------------
// 📦 Storage Config
// ----------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// ----------------------
// 🧩 File Type Validation
// ----------------------
const allowedImageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedListingMimes = [...allowedImageMimes, 'video/mp4', 'video/quicktime'];

const listingFileFilter = (req, file, cb) => {
  if (allowedListingMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images and videos are allowed.`), false);
  }
};

const profileFileFilter = (req, file, cb) => {
  if (allowedImageMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images are allowed for profile picture.`), false);
  }
};

// ----------------------
// 🎬 Upload Instances
// ----------------------

// For listings (images + videos)
const upload = multer({
  storage,
  fileFilter: listingFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10, // Max 10 files
  },
});

// For profile image (only 1 image, max 5MB)
const uploadProfile = multer({
  storage,
  fileFilter: profileFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1,
  },
});

module.exports = {
  upload,         // → used for listings
  uploadProfile,  // → used for profile pictures
};
