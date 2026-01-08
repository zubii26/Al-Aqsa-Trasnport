const CACHE_NAME = 'umrah-app-v1';
const STATIC_ASSETS = [
    '/',
    '/about',
    '/services',
    '/offline.html',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png'
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
    // Exclude other apps scopes if necessary, or just generic handle
    if (event.request.url.includes('/agency') || event.request.url.includes('/driver')) return;

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/offline.html');
            });
        })
    );
});
