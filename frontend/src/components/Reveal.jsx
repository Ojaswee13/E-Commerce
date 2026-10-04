import { useEffect, useRef, useState } from "react"

// true if we should skip the animation (user prefers less motion, or old browser)
const skipAnimation = () => {
  if (typeof window === "undefined") return true
  if (!("IntersectionObserver" in window)) return true
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

// wraps anything and makes it fade in and slide up when it scrolls into view
export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(skipAnimation)

  useEffect(() => {
    if (visible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // animate only once
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  )
}