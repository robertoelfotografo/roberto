// Cache version bumped after content and UX refinements.
const CACHE = 'elfotografo-v3';
const APP_SHELL = './index.html';
// Keep the app shell short and explicit to avoid over-caching dynamic externals.
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './og-image.svg',
  './robots.txt',
  './sitemap.xml',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request)
        .then(res => {
          if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          return res;
        })
        // For simple hosting, navigations fall back to the app shell when offline.
        .catch(() => e.request.mode === 'navigate' ? caches.match(APP_SHELL) : Response.error());
    })
  );
});
