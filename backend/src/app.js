const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/products", require("./routes/productRoutes"))
app.use("/api/cart", require("./routes/cartRoutes"))
app.use("/api/orders", require("./routes/orderRoutes"))
app.use("/api/reviews", require("./routes/reviewRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))

module.exports = app