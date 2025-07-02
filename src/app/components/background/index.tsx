"use client"

import { memo, useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Lazy load all background components
const AnimatedBackground = dynamic(() => import("./AnimatedBackground"), {
  ssr: false,
  loading: () => null,
})

const ParticleField = dynamic(() => import("./ParticleField"), {
  ssr: false,
  loading: () => null,
})

const GlowingOrbs = dynamic(() => import("./GlowingOrbs"), {
  ssr: false,
  loading: () => null,
})

interface BackgroundSystemProps {
  variant?: "animated" | "particles" | "orbs" | "all"
  intensity?: "low" | "medium" | "high"
}

const BackgroundSystem = memo(({ variant = "all", intensity = "medium" }: BackgroundSystemProps) => {
  const [isClient, setIsClient] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setIsClient(true)

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
    // SSR fallback
    return (
      <div className="fixed inset-0 pointer-events-none z-[-10] bg-gradient-to-br from-gray-900 via-purple-900/20 to-black" />
    )
  }

  if (reducedMotion) {
    // Static background for reduced motion
    return (
      <div className="fixed inset-0 pointer-events-none z-[-10]">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>
    )
  }

  const opacityClass = intensity === "low" ? "opacity-40" : intensity === "high" ? "opacity-80" : "opacity-60"

  return (
    <div className={`fixed inset-0 pointer-events-none z-[-10] ${opacityClass}`}>
      {/* Base background always present */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black" />

      {/* Render based on variant */}
      {(variant === "animated" || variant === "all") && <AnimatedBackground />}
      {(variant === "particles" || variant === "all") && <ParticleField />}
      {(variant === "orbs" || variant === "all") && <GlowingOrbs />}
    </div>
  )
})

BackgroundSystem.displayName = "BackgroundSystem"

export default BackgroundSystem
