const Cart = require("../models/cart")
const Product = require("../models/product")

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product")
    if (!cart) return res.json({ items: [] })
    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: "Unable to load your cart" })
  }
}

const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body
  const itemQty = Number(quantity)

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" })
  }

  if (!Number.isInteger(itemQty) || itemQty <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive number" })
  }

  try {
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    let cart = await Cart.findOne({ user: req.user.id })

    if (!cart) {
      if (product.stock < itemQty) {
        return res.status(400).json({ message: "Not enough stock available" })
      }
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity: itemQty }],
      })
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      )
      const newQty = existingItem ? existingItem.quantity + itemQty : itemQty

      if (product.stock < newQty) {
        return res.status(400).json({ message: "Not enough stock available" })
      }

      if (existingItem) {
        existingItem.quantity = newQty
      } else {
        cart.items.push({ product: productId, quantity: itemQty })
      }

      await cart.save()
    }

    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: "Unable to add item to cart" })
  }
}

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    )

    await cart.save()
    res.json(cart)
  } catch (err) {
    res.status(500).json({ message: "Unable to remove item from cart" })
  }
}

module.exports = { getCart, addToCart, removeFromCart }