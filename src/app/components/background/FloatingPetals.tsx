"use client"

import { memo, useEffect, useState } from "react"

interface Petal {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  animationDuration: number
  delay: number
  color: string
}

const FloatingPetals = memo(() => {
  const [petals, setPetals] = useState<Petal[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Generate petals
    const generatePetals = () => {
      const newPetals: Petal[] = []
      const colors = [
        "rgba(236, 72, 153, 0.6)", // pink-500
        "rgba(244, 114, 182, 0.5)", // pink-400
        "rgba(249, 168, 212, 0.4)", // pink-300
        "rgba(139, 92, 246, 0.4)", // violet-500
        "rgba(168, 85, 247, 0.3)", // purple-500
        "rgba(255, 255, 255, 0.3)", // white
      ]

      for (let i = 0; i < 15; i++) {
        newPetals.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 12 + 8, // 8-20px
          rotation: Math.random() * 360,
          animationDuration: Math.random() * 10 + 15, // 15-25s
          delay: Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
      setPetals(newPetals)
    }

    generatePetals()
  }, [])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[-4] overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-float-petal"
          style={{
            left: `${petal.x}%`,
            top: `${petal.y}%`,
            animationDuration: `${petal.animationDuration}s`,
            animationDelay: `${petal.delay}s`,
            willChange: "transform",
          }}
        >
          {/* Cherry Blossom Petal SVG */}
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            style={{
              transform: `rotate(${petal.rotation}deg)`,
              filter: "blur(0.5px)",
            }}
          >
            <path
              d="M12 2C12 2 8 6 8 10C8 14 12 18 12 18C12 18 16 14 16 10C16 6 12 2 12 2Z"
              fill={petal.color}
              opacity="0.8"
            />
            <path
              d="M12 6C12 6 16 8 18 12C20 16 16 18 16 18C16 18 12 14 12 12C12 10 12 6 12 6Z"
              fill={petal.color}
              opacity="0.6"
            />
            <path
              d="M12 6C12 6 8 8 6 12C4 16 8 18 8 18C8 18 12 14 12 12C12 10 12 6 12 6Z"
              fill={petal.color}
              opacity="0.6"
            />
            <path
              d="M12 12C12 12 8 16 8 20C8 24 12 22 12 22C12 22 16 24 16 20C16 16 12 12 12 12Z"
              fill={petal.color}
              opacity="0.4"
            />
            <circle cx="12" cy="12" r="2" fill="rgba(255, 255, 255, 0.8)" opacity="0.9" />
          </svg>
        </div>
      ))}

      {/* Floating Sparkles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              boxShadow: "0 0 6px rgba(255, 255, 255, 0.8)",
            }}
          />
        </div>
      ))}
    </div>
  )
})

FloatingPetals.displayName = "FloatingPetals"

export default FloatingPetals
