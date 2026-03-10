// ======================================================
// Freimel Jerez WebApp — SERVICE WORKER v6
// Cache estático + App Offline + Protección AdSense
// + Desactivar en localhost (Live Server)
// ======================================================

const IS_LOCALHOST =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1" ||
  self.location.hostname === "[::1]";

const CACHE_NAME = "freimel-cache-v6";

const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/main.js",

  // ICONOS PWA
  "/imagen/icons/icon-192.png",
  "/imagen/icons/icon-512.png",
  "/imagen/icons/icon-1024.png",

  // IMÁGENES
  "/imagen/rey-freimel.png",
  "/imagen/sitioweb.png"
];

// Dominios que NO se deben cachear
const DENY_CACHE = [
  "googlesyndication.com",
  "googletagservices.com",
  "google-analytics.com",
  "doubleclick.net"
];


// ======================================================
// 🚫 DESACTIVAR EN LOCALHOST
// ======================================================

if (IS_LOCALHOST) {

  self.addEventListener("install", () => self.skipWaiting());

  self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {

      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));

      await self.registration.unregister();

      const clientsArr = await self.clients.matchAll({ type: "window" });
      clientsArr.forEach(client => client.navigate(client.url));

    })());
  });

  self.addEventListener("fetch", (event) => {
    event.respondWith(fetch(event.request));
  });

}


// ======================================================
// PRODUCCIÓN
// ======================================================

else {

  // =========================
  // INSTALAR
  // =========================

  self.addEventListener("install", (event) => {

    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );

    self.skipWaiting();

  });


  // =========================
  // ACTIVAR
  // =========================

  self.addEventListener("activate", (event) => {

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


  // =========================
  // FETCH
  // =========================

  self.addEventListener("fetch", (event) => {

    const request = event.request;

    // No cachear métodos diferentes a GET
    if (request.method !== "GET") return;

    // No cachear anuncios ni analytics
    if (DENY_CACHE.some(domain => request.url.includes(domain))) {
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(

      caches.match(request).then(cached => {

        if (cached) return cached;

        return fetch(request)

          .then(response => {

            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            const responseClone = response.clone();

            if (request.url.startsWith(self.location.origin)) {

              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });

            }

            return response;

          })

          .catch(() => {

            if (request.destination === "document") {
              return caches.match("/index.html");
            }

          });

      })

    );

  });

}