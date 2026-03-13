// // Mobile-specific performance optimizations
// export class MobilePerformanceOptimizer {
//   private static instance: MobilePerformanceOptimizer
//   private isMobile = false
//   private connectionType = "unknown"

//   static getInstance() {
//     if (!this.instance) {
//       this.instance = new MobilePerformanceOptimizer()
//     }
//     return this.instance
//   }

//   constructor() {
//     if (typeof window !== "undefined") {
//       this.detectMobile()
//       this.detectConnection()
//     }
//   }

//   private detectMobile() {
//     this.isMobile =
//       window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
//   }

//   private detectConnection() {
//     if ("connection" in navigator) {
//       const connection = (navigator as any).connection
//       this.connectionType = connection?.effectiveType || "unknown"
//     }
//   }

//   // Reduce image quality for mobile/slow connections
//   getOptimalImageQuality(): number {
//     if (this.connectionType === "2g" || this.connectionType === "slow-2g") return 40
//     if (this.connectionType === "3g") return 60
//     if (this.isMobile) return 70
//     return 80
//   }

//   // Get optimal image size for mobile
//   getOptimalImageSize(baseWidth: number): number {
//     if (this.isMobile) {
//       return Math.min(baseWidth, 400) // Max 400px for mobile
//     }
//     return baseWidth
//   }

//   // Should use lazy loading
//   shouldUseLazyLoading(index: number): boolean {
//     if (this.connectionType === "2g" || this.connectionType === "slow-2g") {
//       return index > 2 // Load only first 3 images immediately
//     }
//     return index > 4 // Load first 5 images immediately
//   }

//   // Reduce animation complexity on mobile
//   shouldReduceAnimations(): boolean {
//     return this.isMobile || this.connectionType === "2g" || this.connectionType === "slow-2g"
//   }

//   // Get optimal chunk size for virtual scrolling
//   getOptimalChunkSize(): number {
//     if (this.connectionType === "2g") return 10
//     if (this.connectionType === "3g") return 15
//     if (this.isMobile) return 20
//     return 30
//   }
// }

// // Image optimization utilities
// export const MobileImageOptimizer = {
//   // Generate WebP with fallback
//   generateOptimizedSrc(baseUrl: string, width: number, quality = 75): string {
//     if (!baseUrl) return "/placeholder.svg"

//     const optimizer = MobilePerformanceOptimizer.getInstance()
//     const optimalWidth = optimizer.getOptimalImageSize(width)
//     const optimalQuality = optimizer.getOptimalImageQuality()

//     return `${baseUrl}?w=${optimalWidth}&q=${Math.min(quality, optimalQuality)}&f=webp&auto=compress,format`
//   },

//   // Generate responsive srcSet for mobile
//   generateMobileSrcSet(baseUrl: string): string {
//     const sizes = [200, 300, 400] // Mobile-optimized sizes
//     const optimizer = MobilePerformanceOptimizer.getInstance()
//     const quality = optimizer.getOptimalImageQuality()

//     return sizes.map((size) => `${baseUrl}?w=${size}&q=${quality}&f=webp&auto=compress,format ${size}w`).join(", ")
//   },

//   // Preload critical images with priority
//   preloadCriticalImages(urls: string[], count = 3) {
//     if (typeof window === "undefined") return

//     urls.slice(0, count).forEach((url, index) => {
//       const link = document.createElement("link")
//       link.rel = "preload"
//       link.as = "image"
//       link.href = this.generateOptimizedSrc(url, 300)
//       link.fetchPriority = index < 2 ? "high" : "low"
//       document.head.appendChild(link)
//     })
//   },
// }

// // Resource loading optimizer
// export const ResourceOptimizer = {
//   // Defer non-critical resources
//   deferNonCriticalResources() {
//     if (typeof window === "undefined") return

//     // Defer non-critical CSS
//     const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])')
//     nonCriticalCSS.forEach((link) => {
//       const linkElement = link as HTMLLinkElement
//       linkElement.media = "print"
//       linkElement.onload = () => {
//         linkElement.media = "all"
//       }
//     })

//     // Defer non-critical JavaScript
//     const scripts = document.querySelectorAll("script[data-defer]")
//     scripts.forEach((script) => {
//       const scriptElement = script as HTMLScriptElement
//       scriptElement.defer = true
//     })
//   },

//   // Preconnect to critical domains
//   preconnectCriticalDomains() {
//     const domains = [
//       "https://img.otruyenapi.com",
//       "https://otruyenapi.com",
//       "https://fonts.googleapis.com",
//       "https://fonts.gstatic.com",
//     ]

//     domains.forEach((domain) => {
//       const link = document.createElement("link")
//       link.rel = "preconnect"
//       link.href = domain
//       link.crossOrigin = "anonymous"
//       document.head.appendChild(link)
//     })
//   },
// }
