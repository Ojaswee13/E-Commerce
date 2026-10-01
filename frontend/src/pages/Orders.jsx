import { useState, useEffect } from "react"
import { getMyOrders } from "../api/api"

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders()
        setOrders(res.data)
      } catch (err) {
        console.error("Failed to load orders:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const statusStyle = (status) => {
    const styles = {
      delivered: "bg-green-100 text-green-700",
      shipped: "bg-blue-100 text-blue-700",
      processing: "bg-yellow-100 text-yellow-700",
      pending: "bg-gray-100 text-gray-600",
    }
    return styles[status] || "bg-gray-100 text-gray-600"
  }

  if (loading) {
    return <div className="text-center py-24 text-gray-400 text-sm">Loading orders...</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-24 text-gray-400 text-sm">
          No orders yet.{" "}
          <a href="/" className="text-black underline">Start shopping</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-50 rounded-2xl p-5">
              {/* header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Order ID</p>
                  <p className="text-xs font-mono text-gray-500">{order._id}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusStyle(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product?.name || "Product"} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* footer */}
              <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="font-semibold text-sm">
                  Total: ${order.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
