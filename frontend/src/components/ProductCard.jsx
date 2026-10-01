import { Link } from "react-router-dom"
import { getImageUrl } from "../api/api"

export default function ProductCard({ product }) {
  const imageUrl = getImageUrl(product.image)

  return (
    <Link to={`/product/${product._id}`} className="group block">
      <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-square mb-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}
      </div>
      <h3 className="font-medium text-sm truncate">{product.name}</h3>
      <p className="text-gray-400 text-xs mt-0.5 capitalize">{product.category || "—"}</p>
      <p className="font-bold text-sm mt-1">${product.price}</p>
    </Link>
  )
}