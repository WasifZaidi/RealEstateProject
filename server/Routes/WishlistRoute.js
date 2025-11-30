const express = require('express')

const { isAuthenticated, authorizeRoles } = require('../middelware/auth')
const { saveListing, getWishlist, getListingsForCompare, getWishlistMinimal } = require('../Controllers/WishlistController')
const router = express.Router()
router.post("/saveToList", isAuthenticated("user_token_realEstate"), authorizeRoles("user", "admin", "manager", "agent"), saveListing)
router.get("/getSaveListings", isAuthenticated("user_token_realEstate"), authorizeRoles("user", "admin", "manager", "agent"), getWishlist)
router.get("/getWishlistMinimal" ,isAuthenticated("user_token_realEstate"), authorizeRoles("user", "admin", "manager", "agent"), getWishlistMinimal)
router.post("/getListingForCompare", isAuthenticated("user_token_realEstate"), authorizeRoles("user", "admin", "manager", "agent"), getListingsForCompare)
module.exports = router