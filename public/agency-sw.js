const CACHE_NAME = 'agency-transport-v1';
const OFFLINE_URL = '/offline.html'; // We can create a specific agency offline page later if needed

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.add(OFFLINE_URL).catch(() => {
                console.log('Offline page not found, skipping cache.');
            });
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
            fetch(event.request)
                .catch(() => {
                    return caches.match(OFFLINE_URL) || fetch(event.request);
                })
        );
        return;
    }

    event.respondWith(fetch(event.request));
});

self.addEventListener('push', function (event) {
    if (event.data) {
        try {
            const data = event.data.json();
            const options = {
                body: data.body,
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                vibrate: [100, 50, 100],
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: '2',
                    url: data.url || '/agency/dashboard'
                },
                actions: [
                    { action: 'explore', title: 'View Details', icon: '/icons/checkmark.png' },
                    { action: 'close', title: 'Close', icon: '/icons/xmark.png' },
                ]
            };
            event.waitUntil(
                self.registration.showNotification(data.title, options)
            );
        } catch (e) {
            console.error('Error processing push notification:', e);
        }
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    const urlToOpen = event.notification.data?.url || '/agency/dashboard';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
