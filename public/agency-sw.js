
const CACHE_NAME = 'agency-app-v1';
const STATIC_ASSETS = [
    '/offline.html',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/agency-screenshot.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Only handle requests within the /agency/ scope
    if (!event.request.url.includes('/agency/')) return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/offline.html');
            });
        })
    );
});
