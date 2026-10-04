import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const isHome = location.pathname === "/"


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])


  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate("/login")
  }


  const barStyle = isHome
    ? `fixed top-0 inset-x-0 z-30 transition-colors duration-300 ${
        scrolled || menuOpen ? "bg-black" : "bg-transparent"
      }`
    : "sticky top-0 z-30 bg-black"

  const linkClass = "text-gray-200 hover:text-white transition-colors"

  return (
    <nav className={`${barStyle} text-white`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-widest">SHOP.CO</Link>


        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 -mr-2"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            viewBox="0 0 24 24"
          >
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>


        <div
          className={`${menuOpen ? "flex" : "hidden"} md:flex flex-col items-start md:flex-row md:items-center gap-4 md:gap-6 text-sm absolute md:static top-full inset-x-0 bg-black md:bg-transparent px-6 py-5 md:p-0 border-t border-white/10 md:border-0`}
        >
          <Link to="/" onClick={closeMenu} className={linkClass}>Shop</Link>

          {user ? (
            <>
              <Link to="/cart" onClick={closeMenu} className={linkClass}>Cart</Link>
              <Link to="/orders" onClick={closeMenu} className={linkClass}>Orders</Link>
              {user.role === "admin" && (
                <Link to="/admin" onClick={closeMenu} className={linkClass}>Admin</Link>
              )}
              <span className="hidden md:inline text-gray-500">|</span>
              <span className="text-gray-300 text-xs">{user.name}</span>
              <button onClick={handleLogout} className={linkClass}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className={linkClass}>Login</Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}