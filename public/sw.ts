// /// <reference lib="webworker" />

// const CACHE_VERSION = "v1";
// const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;

// const PUBLIC_FILES = [
//   "/",
//   "/global.css",
//   "/favicon.ico",
//   "/logo.png",
//   "/manifest.webmanifest",
// ];

// const cacheFirst = async (request: Request): Promise<Response> => {
//   const cache = await caches.open(STATIC_CACHE_NAME);
//   const cachedResponse = await cache.match(request);
//   return cachedResponse || fetch(request);
// };

// const staleWhileRevalidate = async (request: Request): Promise<Response> => {
//   const cache = await caches.open(STATIC_CACHE_NAME);
//   const cachedResponse = await cache.match(request);
//   const fetchPromise = fetch(request).then(async (response) => {
//     await cache.put(request, response.clone());
//     return response;
//   });
//   return cachedResponse || fetchPromise;
// };

// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(STATIC_CACHE_NAME).then((cache) => {
//       return cache.addAll([
//         ...PUBLIC_FILES,
//         ...self.__WB_MANIFEST.map(({ url }) => url),
//       ]);
//     })
//   );
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) => {
//       return Promise.all(
//         keys
//           .filter((key) => key !== STATIC_CACHE_NAME)
//           .map((key) => caches.delete(key))
//       );
//     })
//   );
// });

// self.addEventListener("fetch", (event) => {
//   const { request } = event;
//   const url = new URL(request.url);

//   if (PUBLIC_FILES.some((file) => url.pathname.endsWith(file))) {
//     event.respondWith(cacheFirst(request));
//     return;
//   }

//   if (url.pathname.startsWith("/_next/static/css")) {
//     event.respondWith(staleWhileRevalidate(request));
//     return;
//   }

//   event.respondWith(fetch(request));
// });

// declare var self: ServiceWorkerGlobalScope & {
//   __WB_MANIFEST: Array<{ url: string; revision: string }>;
// };