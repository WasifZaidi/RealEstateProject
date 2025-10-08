const express = require('express')

const { isAuthenticated, authorizeRoles } = require('../middelware/auth')
const { saveListing, getWishlist, getListingsForCompare } = require('../Controllers/WishlistController')
const router = express.Router()
router.post("/saveToList", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), saveListing)
router.get("/getSaveListings", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), getWishlist)
router.post("/getListingForCompare", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), getListingsForCompare)
module.exports = router