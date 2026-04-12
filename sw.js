// ============================================================
// APD Audit Service Worker — RSU Surya Husadha Nusa Dua
// BUMP VERSION INI SETIAP UPDATE FILE APAPUN
// ============================================================
const CACHE_VERSION = 'apd-surya-v10'; // <-- update tiap deploy
const CACHE_NAME = CACHE_VERSION;

// File yang di-cache untuk offline
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './logo_surya.png',
];

// ===== INSTALL: cache assets baru =====
self.addEventListener('install', event => {
  console.log('[SW] Installing:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
        return cache.add('./index.html'); // fallback minimal
      }))
      .then(() => {
        console.log('[SW] Install complete, skipping waiting...');
        return self.skipWaiting(); // langsung aktif, tidak tunggu tab ditutup
      })
  );
});

// ===== ACTIVATE: hapus SEMUA cache lama =====
self.addEventListener('activate', event => {
  console.log('[SW] Activating:', CACHE_NAME);
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        const deleteOld = cacheNames
          .filter(name => name !== CACHE_NAME) // hapus semua selain yang baru
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          });
        return Promise.all(deleteOld);
      })
      .then(() => {
        console.log('[SW] Old caches cleared. Taking control of all clients...');
        return self.clients.claim(); // ambil kontrol semua tab yang sudah terbuka
      })
      .then(() => {
        // Kirim pesan ke semua tab: minta reload
        return self.clients.matchAll({ type: 'window' });
      })
      .then(clients => {
        clients.forEach(client => {
          console.log('[SW] Sending RELOAD to client:', client.url);
          client.postMessage({ type: 'SW_UPDATED', version: CACHE_VERSION });
        });
      })
  );
});

// ===== FETCH: network-first untuk HTML, cache-first untuk assets =====
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Jangan intercept request ke Google (API/Sheets)
  if (url.hostname.includes('google') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('fonts.g') ||
      url.hostname.includes('script.google')) {
    return; // biarkan browser handle langsung
  }

  // Untuk navigasi (buka halaman): network-first, fallback cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Update cache dengan versi terbaru
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          // Offline: gunakan cache
          return caches.match('./index.html');
        })
    );
    return;
  }

  // Untuk assets (JS, CSS, images): cache-first, update background
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        const networkFetch = fetch(event.request)
          .then(response => {
            if (response && response.status === 200 && event.request.method === 'GET') {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => cached); // fallback ke cache jika offline

        return cached || networkFetch;
      })
  );
});
