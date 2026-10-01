const express = require("express")
const router = express.Router()
const { addReview, getReviews } = require("../controllers/reviewController")
const protect = require("../middlewares/authMiddleware")

router.post("/:productId", protect, addReview)
router.get("/:productId", getReviews)

module.exports = router
