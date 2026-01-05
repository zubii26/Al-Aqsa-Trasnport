const CACHE_NAME = 'driver-cache-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                OFFLINE_URL,
                '/driver/',
                '/offline.html',
                '/android-chrome-192x192.png',
                '/android-chrome-512x512.png',
                '/driver-manifest.json'
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match(OFFLINE_URL);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

self.addEventListener('push', (event) => {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const title = data.title || 'New Job Assignment';
        const options = {
            body: data.message || 'You have a new trip assigned.',
            icon: '/logo.png',
            badge: '/logo.png',
            data: data.url || '/driver/dashboard',
            vibrate: [200, 100, 200]
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    } catch (err) {
        console.error('Push handling failed', err);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data || '/driver/dashboard')
    );
});
