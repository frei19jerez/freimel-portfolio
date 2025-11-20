const CACHE_NAME = "freimel-cache-v2";

const assetsToCache = [
  "index.html",
  "css/styles.css",
  "js/main.js",
  "imagen/favicon.svg",
  "manifest.json",

  // BLOG
  "blog/index.html",
  "blog/css/blog.css",
  "blog/js/blog.js"
];

// INSTALACIÓN DEL SERVICE WORKER
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// ACTIVACIÓN
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (MODO OFFLINE)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si está en caché → devolver
      if (response) return response;

      // Si no, buscar en la red y guardar en caché
      return fetch(event.request)
        .then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        })
        .catch(() => {
          // FALLBACK offline
          if (event.request.destination === "document") {
            return caches.match("index.html");
          }
        });
    })
  );
});
