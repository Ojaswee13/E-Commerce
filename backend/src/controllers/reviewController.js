const Review = require("../models/review")

const addReview = async (req, res) => {
  const { comment } = req.body
  const productId = req.params.productId

  if (!comment || !comment.trim()) {
    return res.status(400).json({ message: "Review comment is required" })
  }

  try {
    const existing = await Review.findOne({ user: req.user.id, product: productId })
    if (existing) {
      return res.status(400).json({ message: "You already reviewed this product" })
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      comment: comment.trim(),
    })

    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ message: "Unable to save your review" })
  }
}

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name")
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: "Unable to load reviews" })
  }
}

module.exports = { addReview, getReviews }