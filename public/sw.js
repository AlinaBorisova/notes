const staticCache = 'notes-static-v2';
const dynamicCache = 'notes-dynamic-v2';

const ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCache).then(cache => {
      console.log('Кеширование статики');
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== staticCache && key !== dynamicCache)
          .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (!request.url.startsWith('http')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);

  return cached || await networkFirst(request);
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCache);

  try {
    const response = await fetch(request);

    if (response.status === 200) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      return caches.match('/index.html');
    }
    if (request.destination === 'script' || request.destination === 'style') {
      throw error;
    }

    return await caches.match('/offline.html');
  }
}
