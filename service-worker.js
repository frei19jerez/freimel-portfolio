// ======================================================
// Freimel Jerez WebApp — SERVICE WORKER v3
// Cache estático + App Offline + Protección AdSense
// ======================================================

const CACHE_NAME = "freimel-cache-v3";

const ASSETS = [
  "/",                     // raíz
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/main.js",
  "/imagen/favicon.svg",

  // BLOG
  "/blog/index.html",
  "/blog/css/blog.css",
  "/blog/js/blog.js",

  // ICONOS PWA
  "/imagen/icons/icon-192.png",
  "/imagen/icons/icon-512.png",
  "/imagen/icons/icon-1024.png"
];

// COSAS QUE NO SE DEBEN CACHEAR (muy importante para AdSense)
const DENY_CACHE = [
  "googlesyndication.com",
  "googletagservices.com",
  "google-analytics.com",
  "doubleclick.net"
];

// INSTALACIÓN
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVACIÓN
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH (MODO OFFLINE + filtro ads)
self.addEventListener("fetch", event => {

  // No cachear anuncios, analytics ni Google JS
  if (DENY_CACHE.some(domain => event.request.url.includes(domain))) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    caches.match(event.request).then(cacheRes => {
      if (cacheRes) return cacheRes; // cache hit

      return fetch(event.request)
        .then(networkRes => {
          // Guardar solo peticiones del propio sitio
          if (event.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkRes.clone());
            });
          }
          return networkRes;
        })
        .catch(() => {
          // Fallback cuando no hay internet
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
