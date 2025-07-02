// Advanced Performance Optimization System
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private observers: Map<string, IntersectionObserver> = new Map()
  private imageCache: Map<string, HTMLImageElement> = new Map()
  private prefetchQueue: Set<string> = new Set()

  static getInstance() {
    if (!this.instance) {
      this.instance = new PerformanceOptimizer()
    }
    return this.instance
  }

  // Lazy loading với intersection observer
  createLazyLoader(threshold = 0.1) {
    if (typeof window === "undefined") return null

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement

            // Load image
            if (element.dataset.src) {
              const img = element as HTMLImageElement
              img.src = element.dataset.src
              img.classList.remove("lazy-loading")
              img.classList.add("lazy-loaded")
              observer.unobserve(element)
            }

            // Load component
            if (element.dataset.component) {
              this.loadComponent(element.dataset.component)
              observer.unobserve(element)
            }
          }
        })
      },
      {
        threshold,
        rootMargin: "50px 0px", // Preload 50px before entering viewport
      },
    )

    return observer
  }

  // Preload critical images
  preloadCriticalImages(urls: string[]) {
    urls.forEach((url, index) => {
      if (!this.imageCache.has(url)) {
        const img = new Image()
        img.crossOrigin = "anonymous"

        // Prioritize first few images
        if (index < 3) {
          img.loading = "eager"
          img.fetchPriority = "high"
        }

        img.onload = () => this.imageCache.set(url, img)
        img.src = url
      }
    })
  }

  // Smart prefetching based on user behavior
  smartPrefetch(url: string, priority: "low" | "high" = "low") {
    if (this.prefetchQueue.has(url)) return

    this.prefetchQueue.add(url)

    // Use requestIdleCallback for low priority
    if (priority === "low" && "requestIdleCallback" in window) {
      requestIdleCallback(() => this.executePrefetch(url))
    } else {
      this.executePrefetch(url)
    }
  }

  private executePrefetch(url: string) {
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = url
    link.as = url.includes("/api/") ? "fetch" : "document"
    document.head.appendChild(link)
  }

  // Component lazy loading
  private loadComponent(componentName: string) {
    // Dynamic import based on component name
    import(`../components/${componentName}`)
      .then((module) => {
        console.log(`Component ${componentName} loaded`)
      })
      .catch((error) => {
        console.error(`Failed to load component ${componentName}:`, error)
      })
  }

  // Memory cleanup
  cleanup() {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers.clear()
    this.imageCache.clear()
    this.prefetchQueue.clear()
  }
}

// Image optimization utilities
export const ImageOptimizer = {
  // Generate optimized image URLs
  getOptimizedUrl(baseUrl: string, width: number, quality = 75) {
    if (!baseUrl) return "/placeholder.svg"

    // Add WebP support detection
    const supportsWebP = this.supportsWebP()
    const format = supportsWebP ? "webp" : "jpg"

    return `${baseUrl}?w=${width}&q=${quality}&f=${format}&auto=compress`
  },

  // WebP support detection
  supportsWebP(): boolean {
    if (typeof window === "undefined") return false

    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0
  },

  // Generate responsive srcSet
  generateSrcSet(baseUrl: string, sizes: number[] = [320, 640, 768, 1024, 1280]) {
    return sizes.map((size) => `${this.getOptimizedUrl(baseUrl, size)} ${size}w`).join(", ")
  },

  // Preload critical images with priority hints
  preloadImage(src: string, priority: "high" | "low" = "low") {
    if (typeof window === "undefined") return

    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = src
    link.fetchPriority = priority
    document.head.appendChild(link)
  },
}

// Virtual scrolling for large lists
export class VirtualScroller {
  private container: HTMLElement
  private items: any[]
  private itemHeight: number
  private visibleCount: number
  private scrollTop = 0
  private renderCallback: (items: any[], startIndex: number) => void

  constructor(
    container: HTMLElement,
    items: any[],
    itemHeight: number,
    renderCallback: (items: any[], startIndex: number) => void,
  ) {
    this.container = container
    this.items = items
    this.itemHeight = itemHeight
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2
    this.renderCallback = renderCallback

    this.setupScrollListener()
    this.render()
  }

  private setupScrollListener() {
    let ticking = false

    this.container.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this.scrollTop = this.container.scrollTop
            this.render()
            ticking = false
          })
          ticking = true
        }
      },
      { passive: true },
    )
  }

  private render() {
    const startIndex = Math.floor(this.scrollTop / this.itemHeight)
    const endIndex = Math.min(startIndex + this.visibleCount, this.items.length)
    const visibleItems = this.items.slice(startIndex, endIndex)

    this.renderCallback(visibleItems, startIndex)
  }

  updateItems(newItems: any[]) {
    this.items = newItems
    this.render()
  }
}

// Bundle analyzer for development
export const BundleAnalyzer = {
  // Analyze component render times
  measureComponentRender<T>(componentName: string, renderFn: () => T): T {
    if (process.env.NODE_ENV !== "development") {
      return renderFn()
    }

    const start = performance.now()
    const result = renderFn()
    const end = performance.now()

    const renderTime = end - start
    if (renderTime > 16) {
      // More than 1 frame
      console.warn(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`)
    }

    return result
  },

  // Memory usage tracking
  trackMemoryUsage() {
    if (typeof window === "undefined" || !("memory" in performance)) return

    const memory = (performance as any).memory
    console.log("Memory Usage:", {
      used: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    })
  },
}
