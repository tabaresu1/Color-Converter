const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './popup.css',
  './popup.js',
  './icon.png'
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando recursos');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('[SW] Falha ao cachear:', err))
  );
});

self.addEventListener('fetch', event => {
  console.log(`[SW] Fetching: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});