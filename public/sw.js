// Service Worker quản lý cache nâng cao.
const STATIC_CACHE = "static-v2"
const DYNAMIC_CACHE = "dynamic-v2"
const IMAGE_CACHE = "runtime-images-v2"
const OFFLINE_IMAGE_CACHE = "images-v1"
const MAX_DYNAMIC_ENTRIES = 50
const MAX_IMAGE_ENTRIES = 150

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
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== IMAGE_CACHE &&
            cacheName !== OFFLINE_IMAGE_CACHE
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

  // Để trình duyệt kết nối trực tiếp tới MangaDex@Home và các origin bên ngoài.
  if (request.method !== "GET" || url.origin !== self.location.origin) return

  // Không giữ response RSC hoặc static chunk đã có cache HTTP theo hash.
  if (
    request.headers.has("RSC") ||
    url.searchParams.has("_rsc") ||
    url.pathname.startsWith("/_next/")
  ) {
    return
  }

  if (url.pathname.includes("/api/")) {
    event.respondWith(handleAPIRequest(request, event))
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request, event))
  } else if (request.mode === "navigate" && shouldCachePage(url.pathname)) {
    event.respondWith(handlePageRequest(request, event))
  }
})

// API ưu tiên mạng và dùng cache khi mất kết nối.
function handleAPIRequest(request, event) {
  const networkPromise = fetch(request)
  event.waitUntil(
    networkPromise
      .then((response) =>
        response.ok
          ? putWithLimit(DYNAMIC_CACHE, request, response.clone(), MAX_DYNAMIC_ENTRIES)
          : undefined,
      )
      .catch(() => undefined),
  )

  return networkPromise.catch(async () => {
    const cachedResponse = await caches.match(request)
    return cachedResponse || new Response(null, { status: 503 })
  })
}

// Ảnh ưu tiên cache và dùng mạng làm dự phòng.
function handleImageRequest(request, event) {
  let fetchedFromNetwork = false
  const responsePromise = caches.open(IMAGE_CACHE).then(async (cache) => {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) return cachedResponse

    fetchedFromNetwork = true
    return fetch(request)
  })

  event.waitUntil(
    responsePromise
      .then((response) =>
        fetchedFromNetwork && response.ok
          ? putWithLimit(IMAGE_CACHE, request, response.clone(), MAX_IMAGE_ENTRIES)
          : undefined,
      )
      .catch(() => undefined),
  )

  return responsePromise.catch(() => new Response(null, { status: 404 }))
}

// Trang dùng dữ liệu cũ trong khi cập nhật cache nền.
function handlePageRequest(request, event) {
  const networkPromise = fetch(request)
  event.waitUntil(
    networkPromise
      .then((response) =>
        response.ok
          ? putWithLimit(DYNAMIC_CACHE, request, response.clone(), MAX_DYNAMIC_ENTRIES)
          : undefined,
      )
      .catch(() => undefined),
  )

  return caches.open(DYNAMIC_CACHE).then(async (cache) => {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) return cachedResponse

    return networkPromise.catch(() => new Response(null, { status: 404 }))
  })
}

// Các hàm hỗ trợ nhận diện request.
function isImageRequest(request) {
  return request.destination === "image" || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(new URL(request.url).pathname)
}

// URL At-Home trong chapter online hết hạn nhanh; route đăng nhập cũng không được cache dùng chung.
function shouldCachePage(pathname) {
  const isOnlineChapter = /^\/truyen-tranh\/[^/]+\/[^/]+\/?$/.test(pathname)
  const isAuthPage = /^\/(sign-in|sign-up|sso-callback)(\/|$)/.test(pathname)
  return !isOnlineChapter && !isAuthPage
}

// Giới hạn cache runtime để không làm đầy bộ nhớ của thiết bị đọc.
async function putWithLimit(cacheName, request, response, maxEntries) {
  const cache = await caches.open(cacheName)
  await cache.put(request, response)

  const keys = await cache.keys()
  const overflow = keys.length - maxEntries
  if (overflow <= 0) return

  await Promise.all(keys.slice(0, overflow).map((key) => cache.delete(key)))
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
