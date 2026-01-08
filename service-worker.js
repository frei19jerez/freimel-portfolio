// ======================================================
// Freimel Jerez WebApp — SERVICE WORKER v4
// Cache estático + App Offline + Protección AdSense
// + Desactivar en localhost (Live Server)
// ======================================================

const IS_LOCALHOST =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1" ||
  self.location.hostname === "[::1]";

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

if (IS_LOCALHOST) {
  // ======================================================
  // 🚫 LOCALHOST: se desactiva solo, borra caché y no intercepta nada
  // ======================================================

  self.addEventListener("install", () => self.skipWaiting());

  self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
      // Borra TODOS los caches
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));

      // Se desregistra
      await self.registration.unregister();

      // Recarga pestañas abiertas del sitio
      const clientsArr = await self.clients.matchAll({ type: "window" });
      clientsArr.forEach((c) => c.navigate(c.url));
    })());
  });

  // No intercepta requests en localhost
  self.addEventListener("fetch", (event) => {
    event.respondWith(fetch(event.request));
  });

} else {
  // ======================================================
  // ✅ PRODUCCIÓN: Service Worker normal (PWA)
  // ======================================================

  // INSTALACIÓN
  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
  });

  // ACTIVACIÓN
  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
      )
    );
    self.clients.claim();
  });

  // FETCH (offline + filtro Ads)
  self.addEventListener("fetch", (event) => {

    if (DENY_CACHE.some((domain) => event.request.url.includes(domain))) {
      return event.respondWith(fetch(event.request));
    }

    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;

        return fetch(event.request)
          .then((response) => {
            if (event.request.url.startsWith(self.location.origin)) {
              caches.open(CACHE_NAME).then((cache) => {
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
}
