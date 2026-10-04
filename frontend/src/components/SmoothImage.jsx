import { useState } from "react"


export default function SmoothImage({ src, alt, className = "" }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)


  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
        No image
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">

      {!loaded && <div className="absolute inset-0 shimmer" />}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  )
}