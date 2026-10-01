const Order = require("../models/order")
const Cart = require("../models/cart")
const Product = require("../models/product")

const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" })
    }

    const validItems = cart.items.filter((item) => item.product && item.quantity > 0)

    if (validItems.length === 0) {
      return res.status(400).json({ message: "No valid items in cart" })
    }

    for (const item of validItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${item.product.name}` })
      }
    }

    let totalAmount = 0
    const orderItems = validItems.map((item) => {
      totalAmount += item.product.price * item.quantity
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }
    })

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
    })

    for (const item of validItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      })
    }

    cart.items = []
    await cart.save()

    res.status(201).json(order)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong placing the order" })
  }
}

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.product")
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: "Unable to load your orders" })
  }
}

module.exports = { placeOrder, getMyOrders }