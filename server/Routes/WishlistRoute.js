const express = require('express')

const { isAuthenticated, authorizeRoles } = require('../middelware/auth')
const { saveListing, getWishlist, getListingsForCompare, getWishlistMinimal } = require('../Controllers/WishlistController')
const router = express.Router()
router.post("/saveToList", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), saveListing)
router.get("/getSaveListings", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), getWishlist)
router.get("/getWishlistMinimal" ,isAuthenticated("user_token_realEstate"), authorizeRoles("user"), getWishlistMinimal)
router.post("/getListingForCompare", isAuthenticated("user_token_realEstate"), authorizeRoles("user"), getListingsForCompare)
module.exports = router