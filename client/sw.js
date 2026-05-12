const CACHE_NAME = 'schedule-assistant-v1';
const ASSETS = [
  '/',
  '/app.html',
  '/css/style.css',
  '/js/auth.js',
  '/js/chat.js',
  '/js/events.js',
  '/js/socket.js'
];

// install: cache all assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// fetch: serve from cache, fall back to network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});