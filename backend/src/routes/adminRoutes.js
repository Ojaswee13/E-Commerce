const express = require("express")
const router = express.Router()
const { getAllOrders, updateOrderStatus, getAllUsers } = require("../controllers/adminController")
const protect = require("../middlewares/authMiddleware")
const adminOnly = require("../middlewares/adminMiddleware")

router.get("/orders", protect, adminOnly, getAllOrders)
router.put("/orders/:id", protect, adminOnly, updateOrderStatus)
router.get("/users", protect, adminOnly, getAllUsers)

module.exports = router
