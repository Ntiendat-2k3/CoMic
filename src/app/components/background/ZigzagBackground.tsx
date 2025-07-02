"use client"

import { memo, useEffect, useState } from "react"

const ZigzagBackground = memo(() => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[-5] overflow-hidden">
      {/* Zigzag Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        <defs>
          <linearGradient id="zigzagGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f472b6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#db2777" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="zigzagGradient2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Main Zigzag Lines */}
        <path
          d="M0,100 L100,200 L200,100 L300,200 L400,100 L500,200 L600,100 L700,200 L800,100 L900,200 L1000,100 L1100,200 L1200,100 L1300,200 L1400,100 L1500,200 L1600,100 L1700,200 L1800,100 L1900,200 L2000,100"
          stroke="url(#zigzagGradient1)"
          strokeWidth="2"
          fill="none"
          className="animate-zigzag-flow"
        />

        <path
          d="M0,300 L150,400 L300,300 L450,400 L600,300 L750,400 L900,300 L1050,400 L1200,300 L1350,400 L1500,300 L1650,400 L1800,300 L1950,400 L2100,300"
          stroke="url(#zigzagGradient2)"
          strokeWidth="1.5"
          fill="none"
          className="animate-zigzag-flow-reverse"
        />

        <path
          d="M0,500 L120,600 L240,500 L360,600 L480,500 L600,600 L720,500 L840,600 L960,500 L1080,600 L1200,500 L1320,600 L1440,500 L1560,600 L1680,500 L1800,600 L1920,500"
          stroke="url(#zigzagGradient1)"
          strokeWidth="1"
          fill="none"
          className="animate-zigzag-flow-slow"
          opacity="0.5"
        />

        {/* Vertical Zigzag */}
        <path
          d="M100,0 L200,100 L100,200 L200,300 L100,400 L200,500 L100,600 L200,700 L100,800 L200,900 L100,1000 L200,1100 L100,1200"
          stroke="url(#zigzagGradient2)"
          strokeWidth="1.5"
          fill="none"
          className="animate-zigzag-vertical"
          opacity="0.3"
        />

        <path
          d="M1400,0 L1300,120 L1400,240 L1300,360 L1400,480 L1300,600 L1400,720 L1300,840 L1400,960 L1300,1080 L1400,1200"
          stroke="url(#zigzagGradient1)"
          strokeWidth="1"
          fill="none"
          className="animate-zigzag-vertical-reverse"
          opacity="0.2"
        />
      </svg>

      {/* Animated Dots along Zigzag */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-pink-400/30 rounded-full animate-zigzag-dot"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
})

ZigzagBackground.displayName = "ZigzagBackground"

export default ZigzagBackground
