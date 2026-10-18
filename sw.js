'use strict';

// The scope keeps caches for other GitHub Pages projects separate.
const CACHE_PREFIX = `drag-n-drop:${self.registration.scope}:`;
const CACHE_NAME = `${CACHE_PREFIX}v1`;
const APP_URL = new URL('./', self.location.href);
const INDEX_URL = new URL('index.html', APP_URL).href;
const APP_FILES = ['index.html', 'manifest.webmanifest', 'icon.svg'].map(path => new URL(path, APP_URL).href);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_FILES.map(url => new Request(url, {cache: 'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== APP_URL.origin) return;

  const pathURL = url.origin + url.pathname;
  const isAppNavigation = request.mode === 'navigate' && (pathURL === APP_URL.href || pathURL === INDEX_URL);
  if (!isAppNavigation && !APP_FILES.includes(pathURL)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cacheKey = isAppNavigation ? INDEX_URL : pathURL;
    // Prefer current files online, with the complete cached app as an offline fallback.
    try {
      const response = await fetch(request);
      if (response.ok) {
        await cache.put(cacheKey, response.clone()).catch(() => {});
        return response;
      }
      return await cache.match(cacheKey) || response;
    } catch (error) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
      throw error;
    }
  })());
});
