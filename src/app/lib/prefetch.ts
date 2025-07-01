// Intelligent prefetching system
export class PrefetchManager {
  private static prefetchedUrls = new Set<string>()
  private static prefetchQueue: string[] = []
  private static isProcessing = false

  // Prefetch critical resources
  static prefetchCritical(urls: string[]) {
    urls.forEach((url) => {
      if (!this.prefetchedUrls.has(url)) {
        this.prefetchQueue.unshift(url) // Add to front of queue
      }
    })
    this.processPrefetchQueue()
  }

  // Prefetch on hover/focus
  static prefetchOnHover(url: string) {
    if (!this.prefetchedUrls.has(url)) {
      this.prefetchQueue.push(url)
      this.processPrefetchQueue()
    }
  }

  private static async processPrefetchQueue() {
    if (this.isProcessing || this.prefetchQueue.length === 0) return

    this.isProcessing = true

    while (this.prefetchQueue.length > 0) {
      const url = this.prefetchQueue.shift()!

      if (!this.prefetchedUrls.has(url)) {
        try {
          // Use different strategies based on resource type
          if (url.includes("/api/")) {
            await this.prefetchAPI(url)
          } else if (url.match(/\.(jpg|jpeg|png|webp)$/)) {
            await this.prefetchImage(url)
          } else {
            await this.prefetchPage(url)
          }

          this.prefetchedUrls.add(url)
        } catch (error) {
          console.warn("Prefetch failed:", url, error)
        }
      }

      // Yield to main thread
      await new Promise((resolve) => setTimeout(resolve, 0))
    }

    this.isProcessing = false
  }

  private static prefetchAPI(url: string) {
    return fetch(url, {
      method: "GET",
      priority: "low" as RequestPriority,
    }).then((response) => response.json())
  }

  private static prefetchImage(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = resolve
      img.onerror = reject
      img.src = url
    })
  }

  private static prefetchPage(url: string) {
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = url
    document.head.appendChild(link)
    return Promise.resolve()
  }
}
