import { useState, useEffect } from "react"
import { getCart, removeFromCart, placeOrder } from "../api/api"

export default function Cart() {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")
  const [orderLoading, setOrderLoading] = useState(false)

  const fetchCart = async () => {
    try {
      const res = await getCart()
      setCart(res.data)
    } catch (err) {
      console.error("Failed to load cart:", err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId)
      fetchCart()
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to remove item")
      setTimeout(() => setMsg(""), 3000)
    }
  }

  const handlePlaceOrder = async () => {
    setOrderLoading(true)
    setMsg("")
    try {
      await placeOrder()
      setMsg("Order placed successfully! 🎉")
      fetchCart()
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to place order")
    } finally {
      setOrderLoading(false)
      setTimeout(() => setMsg(""), 4000)
    }
  }

  const total = cart.items?.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity
  }, 0)

  if (loading) {
    return <div className="text-center py-24 text-gray-400 text-sm">Loading cart...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">Your Cart</h1>

      {cart.items?.length === 0 ? (
        <div className="text-center py-24 text-gray-400 text-sm">
          Your cart is empty.{" "}
          <a href="/" className="text-black underline">Continue shopping</a>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-8">
            {cart.items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 bg-gray-50 rounded-xl p-4"
              >
                {/* image */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.product?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ${item.product?.price} × {item.quantity}
                  </p>
                </div>

                {/* subtotal */}
                <p className="font-semibold text-sm flex-shrink-0">
                  ${(item.product?.price * item.quantity).toFixed(2)}
                </p>

                {/* remove */}
                <button
                  onClick={() => handleRemove(item.product?._id)}
                  className="text-gray-300 hover:text-red-500 transition-colors text-xs flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* order summary */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="text-sm">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-6 pt-3 border-t border-gray-200">
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={orderLoading}
              className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {orderLoading ? "Placing order..." : "Place Order"}
            </button>

            {msg && (
              <p className={`text-sm mt-3 text-center ${msg.includes("!") ? "text-green-600" : "text-red-500"}`}>
                {msg}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
