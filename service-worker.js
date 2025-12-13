// ======================================================
// Freimel Jerez WebApp — SERVICE WORKER v4
// Cache estático + App Offline + Protección AdSense
// ======================================================

const CACHE_NAME = "freimel-cache-v5";

const ASSETS = [
  "/",                     
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/main.js",

  // ICONOS PWA (existentes)
  "/imagen/icons/icon-192.png",
  "/imagen/icons/icon-512.png",
  "/imagen/icons/icon-1024.png",

  // IMÁGENES reales
  "/imagen/rey-freimel.png",
  "/imagen/sitioweb.png"
];

// NO cachear anuncios
const DENY_CACHE = [
  "googlesyndication.com",
  "googletagservices.com",
  "google-analytics.com",
  "doubleclick.net"
];

// INSTALACIÓN
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVACIÓN
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// FETCH (offline + filtro Ads)
self.addEventListener("fetch", event => {

  if (DENY_CACHE.some(domain => event.request.url.includes(domain))) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (event.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        })
        .catch(() => {
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
