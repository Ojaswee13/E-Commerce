const Order = require("../models/order")
const User = require("../models/user")

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: "Unable to load orders" })
  }
}

const updateOrderStatus = async (req, res) => {
  const { status } = req.body

  if (!status) {
    return res.status(400).json({ message: "Order status is required" })
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (err) {
    res.status(500).json({ message: "Unable to update order status" })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Unable to load users" })
  }
}

module.exports = { getAllOrders, updateOrderStatus, getAllUsers }
