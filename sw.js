const CACHE_NAME = 'portal-ss-v15';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './LogoSS.png'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Obriga o telemóvel a largar a cache antiga instantaneamente
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia Network First: Puxa sempre da web primeiro, se não houver net, usa a memória.
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
