let staticCacheName = "pwa";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(["/"]);
    })
  );
});

self.addEventListener("fetch", e => {
  console.log(e.request.url);

  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});