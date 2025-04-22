// /// <reference lib="webworker" />
// /* eslint-disable no-restricted-globals */
// /* @ts-nocheck */

// const CACHE_NAME = "comic-pages-v1";

// self.addEventListener("install", (event) => {
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((keys) =>
//       Promise.all(
//         keys
//           .filter((key) => key !== CACHE_NAME)
//           .map((key) => caches.delete(key))
//       )
//     )
//   );
//   self.clients.claim();
// });

// self.addEventListener("fetch", (event) => {
//   const url = new URL(event.request.url);
//   if (
//     url.hostname === "sv1.otruyencdn.com" ||
//     url.pathname.includes("/chapter_")
//   ) {
//     event.respondWith(
//       caches.open(CACHE_NAME).then((cache) =>
//         cache.match(event.request).then((cached) =>
//           cached
//             ? cached
//             : fetch(event.request).then((response) => {
//                 cache.put(event.request, response.clone());
//                 return response;
//               })
//         )
//       )
//     );
//   }
// });
