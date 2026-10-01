import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-black text-white px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <Link to="/" className="text-xl font-bold tracking-widest">SHOP.CO</Link>

      <div className="flex items-center gap-6 text-sm">
        <Link to="/" className="text-gray-300 hover:text-white transition-colors">Shop</Link>

        {user ? (
          <>
            <Link to="/cart" className="text-gray-300 hover:text-white transition-colors">Cart</Link>
            <Link to="/orders" className="text-gray-300 hover:text-white transition-colors">Orders</Link>
            {user.role === "admin" && (
              <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">Admin</Link>
            )}
            <span className="text-gray-500">|</span>
            <span className="text-gray-400 text-xs">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">Login</Link>
            <Link
              to="/register"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
