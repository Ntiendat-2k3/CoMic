// Service Worker for advanced caching
const CACHE_NAME = "comic-app-v1"
const STATIC_CACHE = "static-v1"
const DYNAMIC_CACHE = "dynamic-v1"
const IMAGE_CACHE = "images-v1"

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
}

// Routes and their caching strategies
const ROUTE_STRATEGIES = {
  "/": CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  "/api/": CACHE_STRATEGIES.NETWORK_FIRST,
  "/truyen-tranh/": CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  "/the-loai/": CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  "/static/": CACHE_STRATEGIES.CACHE_FIRST,
  "/images/": CACHE_STRATEGIES.CACHE_FIRST,
}

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(["/", "/manifest.json", "/icon-192.png", "/icon-512.png"])
    }),
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== IMAGE_CACHE
          ) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event with intelligent caching
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Handle different types of requests
  if (url.pathname.includes("/api/")) {
    event.respondWith(handleAPIRequest(request))
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else {
    event.respondWith(handlePageRequest(request))
  }
})

// API request handler - Network first with fallback
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    return cachedResponse || new Response("Offline", { status: 503 })
  }
}

// Image request handler - Cache first with network fallback
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return new Response("Image not available", { status: 404 })
  }
}

// Page request handler - Stale while revalidate
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)

  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => null)

  return cachedResponse || (await networkPromise) || new Response("Page not available", { status: 404 })
}

// Helper functions
function isImageRequest(request) {
  return request.destination === "image" || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(new URL(request.url).pathname)
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Handle offline actions when back online
  console.log("Background sync triggered")
}

// Push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Có truyện mới cập nhật!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  }

  event.waitUntil(self.registration.showNotification("TruyenHay", options))
})
