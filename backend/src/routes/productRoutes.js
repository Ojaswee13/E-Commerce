const express = require("express")
const router = express.Router()
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController")
const protect = require("../middlewares/authMiddleware")
const adminOnly = require("../middlewares/adminMiddleware")
const upload = require("../middlewares/upload")

router.get("/", getProducts)
router.get("/:id", getProduct)

router.post("/", protect, adminOnly, upload.single("image"), createProduct)
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct)
router.delete("/:id", protect, adminOnly, deleteProduct)

module.exports = router