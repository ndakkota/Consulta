const CACHE_NAME = "consulta-ativos-v1";
const URLS_TO_CACHE = [
  "/",              // raiz
  "/index.html",    // página principal
  "/manifest.json", // manifest PWA
  "/farmacia.jpg",  // imagem de fundo
  "/ativos.json"    // base de ativos
];

// Instala o Service Worker e faz o pré-cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Ativa e limpa caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// Intercepta requisições e responde do cache quando offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Se existir no cache, retorna
      if (response) {
        return response;
      }
      // Caso contrário, busca na rede e adiciona ao cache
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
