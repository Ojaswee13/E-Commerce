import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getProduct, addToCart, getReviews, addReview } from "../api/api"
import { useAuth } from "../context/AuthContext"

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [comment, setComment] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [cartMsg, setCartMsg] = useState("")
  const [reviewMsg, setReviewMsg] = useState("")
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          getProduct(id),
          getReviews(id),
        ])
        setProduct(productRes.data)
        setReviews(reviewsRes.data)
      } catch (err) {
        console.error("Failed to load product:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      setCartMsg("Please login to add items to cart")
      return
    }
    try {
      await addToCart({ productId: id, quantity })
      setCartMsg("Added to cart!")
    } catch (err) {
      setCartMsg(err.response?.data?.message || "Failed to add to cart")
    } finally {
      setTimeout(() => setCartMsg(""), 3000)
    }
  }

  const handleAddReview = async (e) => {
    e.preventDefault()
    if (!user) {
      setReviewMsg("Please login to leave a review")
      return
    }
    setReviewLoading(true)
    try {
      const res = await addReview(id, { comment })
      setReviews((prev) => [...prev, res.data])
      setComment("")
      setReviewMsg("Review submitted!")
    } catch (err) {
      setReviewMsg(err.response?.data?.message || "Failed to submit review")
    } finally {
      setReviewLoading(false)
      setTimeout(() => setReviewMsg(""), 3000)
    }
  }

  if (loading) {
    return <div className="text-center py-24 text-gray-400 text-sm">Loading...</div>
  }

  if (!product) {
    return <div className="text-center py-24 text-gray-400 text-sm">Product not found</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* product info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
        {/* image */}
        <div className="bg-gray-100 rounded-2xl aspect-square overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No image
            </div>
          )}
        </div>

        {/* details */}
        <div className="flex flex-col justify-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">
            {product.category || "Uncategorized"}
          </p>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-2xl font-semibold mb-5">${product.price}</p>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">{product.description}</p>
          <p className="text-sm text-gray-400 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          {/* quantity + add to cart */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 hover:bg-gray-100 text-lg font-light transition-colors"
              >
                −
              </button>
              <span className="px-4 py-2.5 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-2.5 hover:bg-gray-100 text-lg font-light transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>

          {cartMsg && (
            <p className={`text-sm mt-1 ${cartMsg.includes("!") ? "text-green-600" : "text-red-500"}`}>
              {cartMsg}
            </p>
          )}
        </div>
      </div>

      {/* reviews */}
      <div className="border-t border-gray-100 pt-10">
        <h2 className="text-xl font-bold mb-6">
          Reviews <span className="text-gray-400 font-normal text-base">({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm mb-8">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4 mb-8">
            {reviews.map((review) => (
              <div key={review._id} className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium mb-1">{review.user?.name || "User"}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {user ? (
          <form onSubmit={handleAddReview} className="space-y-3">
            <h3 className="text-sm font-semibold">Write a review</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-colors resize-none"
              required
            />
            <button
              type="submit"
              disabled={reviewLoading}
              className="bg-black text-white px-6 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
            {reviewMsg && (
              <p className={`text-sm ${reviewMsg.includes("!") ? "text-green-600" : "text-red-500"}`}>
                {reviewMsg}
              </p>
            )}
          </form>
        ) : (
          <p className="text-sm text-gray-400">
            <a href="/login" className="text-black underline">Login</a> to leave a review
          </p>
        )}
      </div>
    </div>
  )
}
