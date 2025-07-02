// Advanced caching system
interface CacheItem<T = unknown> {
  data: T
  timestamp: number
  ttl: number
}

interface IndexedDBCacheItem<T = unknown> {
  key: string
  data: T
  timestamp: number
  ttl: number
}

export class AdvancedCacheManager {
  private static instance: AdvancedCacheManager
  private memoryCache = new Map<string, CacheItem>()
  private readonly MAX_MEMORY_ITEMS = 100
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  static getInstance() {
    if (!this.instance) {
      this.instance = new AdvancedCacheManager()
    }
    return this.instance
  }

  // Multi-layer caching: Memory -> IndexedDB -> Network
  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    const memoryResult = this.getFromMemory<T>(key)
    if (memoryResult) return memoryResult

    // Try IndexedDB
    const idbResult = await this.getFromIndexedDB<T>(key)
    if (idbResult) {
      // Store back in memory for faster access
      this.setInMemory(key, idbResult, this.DEFAULT_TTL)
      return idbResult
    }

    return null
  }

  async set<T>(key: string, data: T, ttl = this.DEFAULT_TTL) {
    // Store in memory
    this.setInMemory(key, data, ttl)

    // Store in IndexedDB for persistence
    await this.setInIndexedDB(key, data, ttl)
  }

  private getFromMemory<T>(key: string): T | null {
    const item = this.memoryCache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.memoryCache.delete(key)
      return null
    }

    return item.data as T
  }

  private setInMemory<T>(key: string, data: T, ttl: number) {
    // Implement LRU eviction
    if (this.memoryCache.size >= this.MAX_MEMORY_ITEMS) {
      const firstKey = this.memoryCache.keys().next().value
      if (firstKey) {
        this.memoryCache.delete(firstKey)
      }
    }

    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  private async getFromIndexedDB<T>(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null

    try {
      const db = await this.openDB()
      const transaction = db.transaction(["cache"], "readonly")
      const store = transaction.objectStore("cache")
      const result = await this.promisifyRequest<IndexedDBCacheItem<T>>(store.get(key))

      if (!result) return null

      if (Date.now() - result.timestamp > result.ttl) {
        // Expired, remove it
        const deleteTransaction = db.transaction(["cache"], "readwrite")
        const deleteStore = deleteTransaction.objectStore("cache")
        deleteStore.delete(key)
        return null
      }

      return result.data
    } catch (error) {
      console.warn("IndexedDB get failed:", error)
      return null
    }
  }

  private async setInIndexedDB<T>(key: string, data: T, ttl: number) {
    if (typeof window === "undefined") return

    try {
      const db = await this.openDB()
      const transaction = db.transaction(["cache"], "readwrite")
      const store = transaction.objectStore("cache")

      await this.promisifyRequest(
        store.put({
          key,
          data,
          timestamp: Date.now(),
          ttl,
        }),
      )
    } catch (error) {
      console.warn("IndexedDB set failed:", error)
    }
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ComicAppCache", 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains("cache")) {
          const store = db.createObjectStore("cache", { keyPath: "key" })
          store.createIndex("timestamp", "timestamp")
        }
      }
    })
  }

  private promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  // Cleanup expired items
  async cleanup() {
    // Memory cleanup
    const now = Date.now()
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key)
      }
    }

    // IndexedDB cleanup
    if (typeof window === "undefined") return

    try {
      const db = await this.openDB()
      const transaction = db.transaction(["cache"], "readwrite")
      const store = transaction.objectStore("cache")
      const index = store.index("timestamp")

      const cutoff = now - this.DEFAULT_TTL
      const range = IDBKeyRange.upperBound(cutoff)

      const request = index.openCursor(range)
      request.onsuccess = () => {
        const cursor = request.result
        if (cursor) {
          cursor.delete()
          cursor.continue()
        }
      }
    } catch (error) {
      console.warn("IndexedDB cleanup failed:", error)
    }
  }
}

// Service Worker for background caching
export const ServiceWorkerManager = {
  async register() {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      console.log("Service Worker registered:", registration)

      // Update on new version
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New version available
              this.showUpdateNotification()
            }
          })
        }
      })
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  },

  showUpdateNotification() {
    // Show user notification about update
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Cập nhật mới có sẵn", {
        body: "Tải lại trang để sử dụng phiên bản mới nhất",
        icon: "/icon-192.png",
      })
    }
  },
}
