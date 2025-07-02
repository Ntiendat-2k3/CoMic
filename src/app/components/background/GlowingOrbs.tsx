"use client"

import { memo, useEffect, useState } from "react"

interface Orb {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
}

const GlowingOrbs = memo(() => {
  const [orbs, setOrbs] = useState<Orb[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const colors = [
      "rgba(236, 72, 153, 0.4)", // pink-500
      "rgba(139, 92, 246, 0.4)", // violet-500
      "rgba(219, 39, 119, 0.4)", // pink-600
      "rgba(168, 85, 247, 0.4)", // purple-500
      "rgba(244, 114, 182, 0.4)", // pink-400
      "rgba(147, 51, 234, 0.4)", // purple-600
    ]

    const newOrbs: Orb[] = []
    for (let i = 0; i < 12; i++) {
      newOrbs.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 200 + 100, // 100-300px
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 15, // 15-35s
        delay: Math.random() * 10,
      })
    }
    setOrbs(newOrbs)
  }, [])

  if (!isClient) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full blur-xl"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animation: `float-glow ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  )
})

GlowingOrbs.displayName = "GlowingOrbs"

export default GlowingOrbs
