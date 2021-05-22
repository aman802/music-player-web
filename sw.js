const staticCacheName = "pwa";
const cachedFileURLs = [
  './index.html',
  './style.css',
  './script.js',
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(cachedFileURLs);
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