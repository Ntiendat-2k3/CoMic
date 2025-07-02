"use client"

import { memo, useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  life: number
  maxLife: number
}

const ParticleField = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isClient, setIsClient] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < 80; i++) {
        particlesRef.current.push(createParticle(canvas.width, canvas.height))
      }
    }

    const createParticle = (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      hue: Math.random() * 60 + 300, // Pink to purple range
      life: 0,
      maxLife: Math.random() * 200 + 100,
    })

    const updateParticle = (particle: Particle, width: number, height: number) => {
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life++

      // Wrap around edges
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0

      // Fade out over time
      particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife)

      // Reset particle if it's dead
      if (particle.life >= particle.maxLife) {
        Object.assign(particle, createParticle(width, height))
      }
    }

    const drawParticle = (particle: Particle, ctx: CanvasRenderingContext2D) => {
      ctx.save()
      ctx.globalAlpha = particle.opacity

      // Create gradient for glow effect
      const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 3)
      gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, 1)`)
      gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`)

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw core
      ctx.fillStyle = `hsl(${particle.hue}, 70%, 80%)`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    const drawConnections = (particles: Particle[], ctx: CanvasRenderingContext2D) => {
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            ctx.save()
            ctx.globalAlpha = ((120 - distance) / 120) * 0.3 * particle.opacity * otherParticle.opacity
            ctx.strokeStyle = `hsl(${(particle.hue + otherParticle.hue) / 2}, 70%, 60%)`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        updateParticle(particle, canvas.width, canvas.height)
        drawParticle(particle, ctx)
      })

      // Draw connections
      drawConnections(particlesRef.current, ctx)

      animationRef.current = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isClient])

  if (!isClient) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  )
})

ParticleField.displayName = "ParticleField"

export default ParticleField
