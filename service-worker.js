const CACHE_NAME = "freimel-cache-v1";

const assetsToCache = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/main.js",
  "/blog/index.html",
  "/blog/css/blog.css",
  "/blog/js/blog.js",
  "/imagen/favicon.svg"
];

// Instalar SW
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activar SW
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
});

// Modo offline
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
