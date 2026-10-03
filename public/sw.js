// BABFEZ Service Worker - Instant Update & Anti-Stale
const CACHE_NAME = 'babfez-cache-v' + Date.now();

// 1. Force l'activation immédiate du nouveau Service Worker dès son installation (skipWaiting: true)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. Prend immédiatement le contrôle de toutes les pages actives et purge les anciens caches (clientsClaim: true)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Suppression intégrale de tous les anciens caches locaux PWA
      caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            return caches.delete(key);
          })
        );
      })
    ])
  );
});

// 3. Stratégie Network-First : les requêtes de navigation vont toujours chercher le HTML frais sur le réseau
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
    );
    return;
  }
});
