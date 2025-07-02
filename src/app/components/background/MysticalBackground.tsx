"use client"

import { memo, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Lazy load background components for better performance
const ZigzagBackground = dynamic(() => import("./ZigzagBackground"), {
  ssr: false,
  loading: () => null,
})

const FloatingPetals = dynamic(() => import("./FloatingPetals"), {
  ssr: false,
  loading: () => null,
})

interface MysticalBackgroundProps {
  enableZigzag?: boolean
  enablePetals?: boolean
  intensity?: "low" | "medium" | "high"
}

const MysticalBackground = memo(
  ({ enableZigzag = true, enablePetals = true, intensity = "medium" }: MysticalBackgroundProps) => {
    const [isClient, setIsClient] = useState(false)
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
      setIsClient(true)

      // Check for reduced motion preference
      if (typeof window !== "undefined") {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
        setReducedMotion(mediaQuery.matches)

        const handleChange = (e: MediaQueryListEvent) => {
          setReducedMotion(e.matches)
        }

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
      }
    }, [])

    if (!isClient) {
      // Return a simple background for SSR
      return (
        <div className="fixed inset-0 pointer-events-none z-[-10] bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      )
    }

    if (reducedMotion) {
      // Return static background for users who prefer reduced motion
      return (
        <div className="fixed inset-0 pointer-events-none z-[-10]">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)
              `,
            }}
          />
        </div>
      )
    }

    return (
      <div
        className={`mystical-background fixed inset-0 pointer-events-none z-[-10] ${
          intensity === "low" ? "opacity-30" : intensity === "high" ? "opacity-80" : "opacity-50"
        }`}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        {/* Base mystical gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(219, 39, 119, 0.08) 0%, transparent 50%)
            `,
            animation: "mystical-shift 20s ease-in-out infinite",
          }}
        />

        {/* Zigzag Lines */}
        {enableZigzag && <ZigzagBackground />}

        {/* Floating Petals */}
        {enablePetals && <FloatingPetals />}

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            animation: "grid-pulse 8s ease-in-out infinite",
          }}
        />
      </div>
    )
  },
)

MysticalBackground.displayName = "MysticalBackground"

export default MysticalBackground
