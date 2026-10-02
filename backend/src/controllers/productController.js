const Product = require("../models/product")

// cleans text: lowercase, no hyphens, no extra spaces or symbols
const clean = (text) => {
  return String(text || "")
    .toLowerCase()
    .replace(/['’-]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
}

// counts how many letters are different between two words
// example: distance("tshitt", "tshirt") = 1
const distance = (a, b) => {
  const table = []

  for (let i = 0; i <= a.length; i++) {
    table[i] = [i]
  }
  for (let j = 0; j <= b.length; j++) {
    table[0][j] = j
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      table[i][j] = Math.min(
        table[i - 1][j] + 1,
        table[i][j - 1] + 1,
        table[i - 1][j - 1] + cost
      )
    }
  }

  return table[a.length][b.length]
}

// checks if one typed word matches any word of the product
const wordMatches = (word, productWords) => {
  // longer words are allowed more mistakes
  let allowed = 0
  if (word.length >= 4) allowed = 1
  if (word.length >= 7) allowed = 2

  return productWords.some((p) => p.includes(word) || distance(word, p) <= allowed)
}

// checks if a product matches the whole search text
const productMatches = (product, searchText) => {
  const text = clean(`${product.name || ""} ${product.description || ""} ${product.category || ""}`)
  const productWords = text.split(" ")

  // "t shirt" should match "tshirt"
  const joinedText = text.replace(/ /g, "")
  const joinedSearch = searchText.replace(/ /g, "")
  if (joinedText.includes(joinedSearch)) return true

  // every typed word must match some word of the product
  return searchText.split(" ").every((word) => wordMatches(word, productWords))
}

const getProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice, sort } = req.query

  const query = {}

  // ignores capital letters and extra spaces, so "Kids" still matches "kids"
  if (category) {
    const safeCategory = String(category).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    query.category = { $regex: `^\\s*${safeCategory}\\s*$`, $options: "i" }
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
    let products = await Product.find(query).sort(sortOption)

    // search is done here so we can allow small typing mistakes
    const searchText = clean(search)
    if (searchText) {
      products = products.filter((p) => productMatches(p, searchText))
    }

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
    // save category as clean lowercase text
    const category = req.body.category ? req.body.category.trim().toLowerCase() : ""
    const product = await Product.create({ ...req.body, category, image })
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: "Please provide valid product details" })
  }
}

const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body }
    if (updateData.category) updateData.category = updateData.category.trim().toLowerCase()
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