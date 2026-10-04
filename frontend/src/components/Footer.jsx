import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Footer() {
  const { user } = useAuth()

  return (

    <footer className="relative w-full bg-black text-white overflow-hidden min-h-[560px] md:min-h-[600px] flex flex-col justify-end">
      <img
        src="/footer.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[46%_12%]"

        onError={(e) => {
          e.target.style.display = "none"
        }}
      />

     
      <div className="absolute inset-0 bg-gradient-to-t from-black from-15% via-black/60 via-50% to-black/20" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        
          <div>
            <h3 className="text-sm font-bold tracking-widest mb-3">SHOP.CO</h3>
            <p className="text-3xl md:text-4xl font-bold leading-tight max-w-xs mb-3">
              Stand out in any crowd.
            </p>
            <p className="text-gray-300 text-sm max-w-xs">
              Simple clothing store with clean and elegant style.
            </p>
          </div>


          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-3">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/" className="hover:text-white transition-colors">All Products</Link></li>
                <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
                <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase mb-3">Account</h4>
              {user ? (
                <p className="text-sm text-gray-300">Logged in as {user.name}</p>
              ) : (
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                  <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
                </ul>
              )}
            </div>
          </div>
        </div>


        <div className="border-t border-white/20 mt-10 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} SHOP.CO.</p>
        </div>
      </div>
    </footer>
  )
}