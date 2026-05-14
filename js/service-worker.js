const CACHE_NAME = "resenatuapto-v1";

const urlsToCache = [
    "./",
    "./index.html",
    "./pages/buscar.html",
    "./pages/resenar.html",
    "./pages/sobre.html",
    "./assets/css/style.css",
    "./js/main.js",
    "./js/firebase-config.js",
    "./manifest.json"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});