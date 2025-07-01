// Performance monitoring và optimization utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()

  static getInstance() {
    if (!this.instance) {
      this.instance = new PerformanceMonitor()
    }
    return this.instance
  }

  // Measure component render time
  measureRender(componentName: string, fn: () => void) {
    const start = performance.now()
    fn()
    const end = performance.now()
    this.metrics.set(componentName, end - start)

    if (end - start > 16) {
      // > 1 frame
      console.warn(`Slow render: ${componentName} took ${end - start}ms`)
    }
  }

  // Measure API response time
  async measureAPI<T>(apiName: string, apiCall: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await apiCall()
      const end = performance.now()
      this.metrics.set(`api_${apiName}`, end - start)
      return result
    } catch (error) {
      const end = performance.now()
      this.metrics.set(`api_${apiName}_error`, end - start)
      throw error
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
}

// Image optimization utilities
export const imageOptimization = {
  // Generate responsive image URLs
  getResponsiveImageUrl(baseUrl: string, width: number, quality = 75) {
    return `${baseUrl}?w=${width}&q=${quality}&f=webp`
  },

  // Preload critical images
  preloadImage(src: string, priority = false) {
    if (typeof window === "undefined") return

    const link = document.createElement("link")
    link.rel = priority ? "preload" : "prefetch"
    link.as = "image"
    link.href = src
    document.head.appendChild(link)
  },

  // Lazy load with intersection observer
  createLazyLoader() {
    if (typeof window === "undefined") return null

    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove("lazy")
            }
          }
        })
      },
      { rootMargin: "50px" },
    )
  },
}

// Cache management
export class CacheManager {
  private static readonly CACHE_PREFIX = "comic_app_"
  private static readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  static set<T>(key: string, data: T, ttl = this.DEFAULT_TTL) {
    if (typeof window === "undefined") return

    const item = {
      data,
      timestamp: Date.now(),
      ttl,
    }

    try {
      localStorage.setItem(`${this.CACHE_PREFIX}${key}`, JSON.stringify(item))
    } catch (error) {
      console.warn("Cache storage failed:", error)
    }
  }

  static get<T>(key: string): T | null {
    if (typeof window === "undefined") return null

    try {
      const item = localStorage.getItem(`${this.CACHE_PREFIX}${key}`)
      if (!item) return null

      const parsed = JSON.parse(item)
      const now = Date.now()

      if (now - parsed.timestamp > parsed.ttl) {
        this.remove(key)
        return null
      }

      return parsed.data
    } catch (error) {
      console.warn("Cache retrieval failed:", error)
      return null
    }
  }

  static remove(key: string) {
    if (typeof window === "undefined") return
    localStorage.removeItem(`${this.CACHE_PREFIX}${key}`)
  }

  static clear() {
    if (typeof window === "undefined") return

    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  }
}
