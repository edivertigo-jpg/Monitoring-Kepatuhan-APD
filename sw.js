// ============================================================
// SERVICE WORKER — APD Monitor PWA
// ============================================================
const CACHE_NAME    = 'apd-monitor-v1';
const API_ORIGIN    = 'https://script.google.com';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
];

// ── INSTALL: cache static assets ────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean old caches ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: strategy based on request type ───────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Google Apps Script API → Network first, fallback to offline response
  if (url.origin === API_ORIGIN) {
    event.respondWith(networkFirstWithOfflineFallback(request));
    return;
  }

  // Google Fonts → Cache first
  if (url.origin === 'https://fonts.googleapis.com' ||
      url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // CDN assets (Chart.js etc) → Cache first
  if (url.hostname.includes('jsdelivr.net') ||
      url.hostname.includes('cdnjs.cloudflare.com')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // App shell → Stale while revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ── Strategy: Cache First ────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// ── Strategy: Stale While Revalidate ────────────────────────
async function staleWhileRevalidate(request) {
  const cache  = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || await fetchPromise ||
    new Response('<h2>Sedang Offline</h2><p>Periksa koneksi internet Anda.</p>',
      { headers: { 'Content-Type': 'text/html' } });
}

// ── Strategy: Network First (with offline JSON fallback) ─────
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch {
    // Return a meaningful offline JSON response
    const offlineData = {
      error: 'Tidak ada koneksi internet. Data tidak dapat dimuat.',
      offline: true,
      totalObservasi: 0,
      totalPatuh: 0,
      totalTidakPatuh: 0,
      persentasePatuh: 0,
      byArea: {}, byUnit: {}, byProfesi: {}, byMonth: {},
      rows: [], headers: [], total: 0
    };
    return new Response(JSON.stringify(offlineData), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ── Background Sync (future use) ─────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-laporan') {
    event.waitUntil(syncPendingLaporan());
  }
});

async function syncPendingLaporan() {
  // Placeholder for future offline-queue sync
  console.log('[SW] Background sync triggered');
}

// ── Push Notifications (future use) ──────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'APD Monitor', {
      body: data.body || 'Ada pembaruan data kepatuhan APD.',
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      data: { url: data.url || './' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || './')
  );
});
