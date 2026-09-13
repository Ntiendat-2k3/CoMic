// Service Worker quản lý cache nâng cao.
const CACHE_NAME = "comic-app-v1"
const STATIC_CACHE = "static-v1"
const DYNAMIC_CACHE = "dynamic-v1"
const IMAGE_CACHE = "images-v1"

// Các chiến lược cache.
const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
}

// Ánh xạ route với chiến lược cache.
const ROUTE_STRATEGIES = {
  "/": CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  "/api/": CACHE_STRATEGIES.NETWORK_FIRST,
  "/truyen-tranh/": CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  "/the-loai/": CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
  "/static/": CACHE_STRATEGIES.CACHE_FIRST,
  "/images/": CACHE_STRATEGIES.CACHE_FIRST,
}

// Khởi tạo cache tĩnh khi cài đặt.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache
        .addAll([
          "/",
          "/locales/vi.json",
        ])
        .catch((error) => {
          // Không làm hỏng quá trình cài đặt nếu một tài nguyên tĩnh thất bại.
          return Promise.resolve()
        })
    }),
  )
  self.skipWaiting()
})

// Xóa các phiên bản cache cũ khi kích hoạt.
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

// Chọn chiến lược cache theo loại request.
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Bỏ qua request không phải GET.
  if (request.method !== "GET") return

  // Phân loại API, ảnh và trang HTML.
  if (url.pathname.includes("/api/")) {
    event.respondWith(handleAPIRequest(request))
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request))
  } else {
    event.respondWith(handlePageRequest(request))
  }
})

// API ưu tiên mạng và dùng cache khi mất kết nối.
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
    return cachedResponse || new Response(null, { status: 503 })
  }
}

// Ảnh ưu tiên cache và dùng mạng làm dự phòng.
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
    return new Response(null, { status: 404 })
  }
}

// Trang dùng dữ liệu cũ trong khi cập nhật cache nền.
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

  return cachedResponse || (await networkPromise) || new Response(null, { status: 404 })
}

// Các hàm hỗ trợ nhận diện request.
function isImageRequest(request) {
  return request.destination === "image" || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(new URL(request.url).pathname)
}

// Đồng bộ lại thao tác khi thiết bị có mạng.
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // Chỗ mở rộng cho hàng đợi thao tác offline.
}

async function loadDictionary() {
  const request = new Request("/locales/vi.json")
  const cached = await caches.match(request)
  const response = cached || await fetch(request)
  return response.json()
}

// Nội dung notification cũng lấy từ dictionary dùng chung của ứng dụng.
self.addEventListener("push", (event) => {
  event.waitUntil((async () => {
    const dictionary = await loadDictionary()
    const options = {
      body: event.data ? event.data.text() : dictionary.pwa.pushDefault,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    }

    await self.registration.showNotification(dictionary.brand.name, options)
  })())
})
