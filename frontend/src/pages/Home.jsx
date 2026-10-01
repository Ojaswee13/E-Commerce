import { useState, useEffect } from "react"
import { getProducts } from "../api/api"
import ProductCard from "../components/ProductCard"

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("")
  const [sort, setSort] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = {}
        if (searchQuery) params.search = searchQuery
        if (category) params.category = category
        if (sort) params.sort = sort

        const res = await getProducts(params)
        setProducts(res.data)
      } catch (err) {
        console.error("Failed to fetch products:", err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery, category, sort])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* hero section */}
      <div className="bg-black text-white rounded-2xl px-10 py-14 mb-10 flex flex-col items-start">
        <p className="text-gray-400 text-xs tracking-widest uppercase mb-3">New Collection</p>
        <h1 className="text-4xl font-bold leading-snug mb-4 max-w-sm">
          Find clothes that match your style
        </h1>
        <p className="text-gray-400 text-sm max-w-xs mb-8">
          Browse our range of quality garments designed to bring out your individuality.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
          className="bg-white text-black px-7 py-2.5 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Shop Now
        </button>
      </div>

      {/* search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </form>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white"
        >
          <option value="">All Categories</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="casual">Casual</option>
          <option value="formal">Formal</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-black bg-white"
        >
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* products */}
      {loading ? (
        <div className="text-center py-24 text-gray-400 text-sm">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400 text-sm">No products found</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
