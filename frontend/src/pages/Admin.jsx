import { useState, useEffect } from "react"
import {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  getProducts,
  createProduct,
  deleteProduct,
  getImageUrl,
} from "../api/api"

export default function Admin() {
  const [tab, setTab] = useState("orders")
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState("")

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const showMsg = (text) => {
    setMsg(text)
    setTimeout(() => setMsg(""), 3000)
  }

  useEffect(() => {
    const fetchTabData = async () => {
      setLoading(true)
      try {
        if (tab === "orders") {
          const res = await getAllOrders()
          setOrders(res.data)
        } else if (tab === "users") {
          const res = await getAllUsers()
          setUsers(res.data)
        } else if (tab === "products") {
          const res = await getProducts({})
          setProducts(res.data)
        }
      } catch (err) {
        console.error("Admin fetch failed:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTabData()
  }, [tab])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status)
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)))
      showMsg("Order status updated")
    } catch (err) {
      showMsg("Failed to update status")
    }
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", form.name)
      formData.append("description", form.description)
      formData.append("price", form.price)
      formData.append("category", form.category)
      formData.append("stock", form.stock)
      if (imageFile) formData.append("image", imageFile)

      await createProduct(formData)
      setForm({ name: "", description: "", price: "", category: "", stock: "" })
      setImageFile(null)
      setImagePreview(null)
      const res = await getProducts({})
      setProducts(res.data)
      showMsg("Product added!")
    } catch (err) {
      showMsg(err.response?.data?.message || "Failed to create product")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      showMsg("Product deleted")
    } catch (err) {
      showMsg("Failed to delete product")
    }
  }

  const statusStyle = (status) => {
    const styles = {
      delivered: "bg-green-100 text-green-700",
      shipped: "bg-blue-100 text-blue-700",
      processing: "bg-yellow-100 text-yellow-700",
      pending: "bg-gray-100 text-gray-600",
    }
    return styles[status] || "bg-gray-100 text-gray-600"
  }

  const tabs = ["orders", "users", "products"]

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 pb-3 text-sm font-medium capitalize transition-colors ${
              tab === t
                ? "border-b-2 border-black text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {msg && (
        <p className={`text-sm mb-5 px-4 py-3 rounded-xl ${msg.includes("!") || msg.includes("updated") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          {msg}
        </p>
      )}

      {loading && (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
      )}

      {/* orders */}
      {!loading && tab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-10">No orders yet</p>
          )}
          {orders.map((order) => (
            <div key={order._id} className="bg-gray-50 rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs text-gray-400">
                    Customer:{" "}
                    <span className="text-gray-700 font-medium">{order.user?.name}</span>
                  </p>
                  <p className="text-xs text-gray-400">{order.user?.email}</p>
                  <p className="text-xs font-mono text-gray-300 mt-0.5">{order._id}</p>
                </div>
                <span className="font-semibold text-sm">${order.totalAmount?.toFixed(2)}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusStyle(order.status)}`}>
                  {order.status}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-black bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* users */}
      {!loading && tab === "users" && (
        <div className="space-y-3">
          {users.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-10">No users found</p>
          )}
          {users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-gray-50 rounded-xl px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                  user.role === "admin" ? "bg-black text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {user.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* products */}
      {!loading && tab === "products" && (
        <div>
          <h2 className="text-base font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleCreateProduct} className="bg-gray-50 rounded-xl p-5 mb-8 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
                required
                className="sm:col-span-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white"
              />
              <input
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Price"
                type="number"
                min="0"
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white"
              />
              <input
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Stock quantity"
                type="number"
                min="0"
                required
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white"
              />
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Category"
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white"
              />

              {/* file upload */}
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer border border-dashed border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:border-black transition-colors text-center">
                  {imageFile ? imageFile.name : "Upload image"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="preview" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                )}
              </div>

              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description (optional)"
                rows={2}
                className="sm:col-span-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white resize-none"
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white px-6 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors"
            >
              Add Product
            </button>
          </form>

          <h2 className="text-base font-semibold mb-4">All Products ({products.length})</h2>
          <div className="space-y-3">
            {products.length === 0 && (
              <p className="text-gray-400 text-sm">No products yet</p>
            )}
            {products.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-4 bg-gray-50 rounded-xl px-5 py-4"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {getImageUrl(product.image) ? (
                    <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">${product.price} · {product.stock} in stock</p>
                </div>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}