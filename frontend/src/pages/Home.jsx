import { useState, useEffect, useRef } from "react"
import { getProducts } from "../api/api"
import ProductCard from "../components/ProductCard"
import Reveal from "../components/Reveal"

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("")
  const [sort, setSort] = useState("")

  // used for the parallax effect
  const heroRef = useRef(null)
  const heroImgRef = useRef(null)

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

  // parallax: the hero photo moves a little slower than the page
  useEffect(() => {
    // skip it if the user turned off motion in their system
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let waiting = false

    const moveImage = () => {
      const hero = heroRef.current
      const img = heroImgRef.current
      if (hero && img) {
        // never move more than the extra 20% height of the photo, so no gap shows
        const scrolled = Math.min(window.scrollY, hero.offsetHeight)
        img.style.transform = `translateY(${scrolled * 0.2}px)`
      }
      waiting = false
    }

    const handleScroll = () => {
      if (!waiting) {
        waiting = true
        requestAnimationFrame(moveImage)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQuery(searchInput)
  }

  // scrolls down to the products section
  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })
  }

  // smooth fade from solid black (left edge of the photo) to see-through (right side)
  // many small steps are used so no line or band can be seen
  const fadeFromLeft =
    "linear-gradient(to right, rgb(0,0,0) 0%, rgba(0,0,0,0.97) 10%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.78) 32%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.4) 58%, rgba(0,0,0,0.2) 72%, rgba(0,0,0,0.07) 86%, rgba(0,0,0,0) 100%)"

  return (
    <div>
      {/* hero: full width, edge to edge, starts at the very top behind the navbar */}
      <section
        ref={heroRef}
        className="relative w-full bg-black text-white overflow-hidden min-h-[620px] md:min-h-[88vh] flex items-end md:items-center"
      >
        {/* photo area: full background on phones, right side on bigger screens */}
        <div className="absolute inset-0 md:inset-auto md:right-0 md:top-0 md:h-full md:w-3/5">
          {/* the photo is 20% taller than its area, so it can move without showing a gap */}
          <img
            ref={heroImgRef}
            src="/hero.jpg"
            alt="SHOP.CO collection"
            className="absolute left-0 -top-[20%] w-full h-[120%] object-cover object-[50%_17%] will-change-transform"
            // hides the image if the file is missing
            onError={(e) => {
              e.target.style.display = "none"
            }}
          />

          {/* phones: fade from the bottom */}
          <div className="absolute inset-0 md:hidden bg-gradient-to-t from-black via-black/60 to-black/10" />

          {/* bigger screens: fade from the left, fully black exactly at the photo's edge */}
          <div
            className="absolute inset-y-0 -left-px right-0 hidden md:block"
            style={{ backgroundImage: fadeFromLeft }}
          />
        </div>

        {/* dark fade at the top so the navbar links are easy to read over the photo */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/70 to-transparent" />

        {/* text, kept in the same width as the navbar and the rest of the site */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-16 md:pt-24 md:pb-8">
          <div className="max-w-xl">
            <p className="text-gray-300 text-xs tracking-widest uppercase mb-3">New Collection</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 max-w-md">
              Find clothes that match your style
            </h1>
            <p className="text-gray-300 text-sm max-w-xs mb-8">
              Browse our range of quality garments designed to bring out your individuality.
            </p>
            <button
              onClick={scrollToProducts}
              className="bg-white text-black px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-gray-200 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* products section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* the id stays outside the animation so "Shop Now" scrolls to the right place */}
        <div id="products" className="scroll-mt-24">
          <Reveal>
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
          </Reveal>
        </div>

        {/* products */}
        {loading ? (
          <div className="text-center py-24 text-gray-400 text-sm">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-gray-400 text-sm">No products found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              // each card appears a little after the one before it
              <Reveal key={product._id} delay={(index % 4) * 80}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}