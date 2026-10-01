const Product = require("../models/product")

const getProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice, sort } = req.query

  const query = {}

  if (search) {
    query.name = { $regex: search, $options: "i" }
  }

  if (category) {
    query.category = category
  }

  if (minPrice || maxPrice) {
    query.price = {}
    if (minPrice) query.price.$gte = Number(minPrice)
    if (maxPrice) query.price.$lte = Number(maxPrice)
  }

  const sortOption = {}
  if (sort === "price_asc") sortOption.price = 1
  if (sort === "price_desc") sortOption.price = -1
  if (sort === "newest") sortOption.createdAt = -1

  try {
    const products = await Product.find(query).sort(sortOption)
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch products at the moment" })
  }
}

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: "Unable to load product details" })
  }
}

const createProduct = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : ""
    const product = await Product.create({ ...req.body, image })
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: "Please provide valid product details" })
  }
}

const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body }
    if (req.file) updateData.image = `/uploads/${req.file.filename}`

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: "Unable to update product details" })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    res.json({ message: "Product removed successfully" })
  } catch (err) {
    res.status(500).json({ message: "Unable to delete product right now" })
  }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct }