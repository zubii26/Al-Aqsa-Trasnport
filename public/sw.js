// ═══════════════════════════════════════════════════════════════════════════
// Al Aqsa Umrah Transport — Service Worker v2
// ═══════════════════════════════════════════════════════════════════════════
// Key improvements over v1:
// - Detects stale chunk 404s and forces cache-busting page reload
// - Bumped cache version to force re-installation on all clients
// - Network-first for all _next assets (never serve stale JS/CSS)
// ═══════════════════════════════════════════════════════════════════════════

const CACHE_NAME = 'umrah-transport-v2';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.add(OFFLINE_URL).catch(() => {
                console.log('Offline page not found, skipping cache.');
            });
        })
    );
    // Force the waiting service worker to become the active one immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete ALL old caches (not just non-matching ones)
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Take control of all open tabs immediately
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // ── Handle Next.js chunk requests ────────────────────────────────────
    // If a _next/static chunk returns 404 or fails, it means the server
    // has recompiled (new deployment or dev restart). Tell the client to
    // do a hard reload to get the new HTML with new chunk references.
    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(
            fetch(event.request).then((response) => {
                if (!response.ok && (response.status === 404 || response.status === 500)) {
                    console.error('[SW] Chunk failed:', url.pathname, response.status);
                    // Notify all open tabs to reload
                    self.clients.matchAll({ type: 'window' }).then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({
                                type: 'CHUNK_LOAD_FAILED',
                                url: url.pathname,
                            });
                        });
                    });
                }
                return response;
            }).catch((error) => {
                console.error('[SW] Chunk fetch error:', url.pathname, error);
                // Network error — let it propagate so the error boundary handles it
                throw error;
            })
        );
        return;
    }

    // ── Handle navigation requests (page loads) ──────────────────────────
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(OFFLINE_URL) || fetch(event.request);
                })
        );
        return;
    }

    // ── Default: network passthrough ─────────────────────────────────────
    event.respondWith(fetch(event.request));
});

// ── Push notification handling ───────────────────────────────────────────
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
                    url: data.url || '/'
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
