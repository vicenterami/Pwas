caches.keys().then(function(names) {
  for (let name of names) caches.delete(name);
});


const urlsToCache = [
  './',
  './index.html',
  './tarea_04.js', // Asegúrate de que este es el nombre correcto de tu archivo principal
  './manifest.json',
  './libraries/p5.min.js' // Incluye esta línea si usas p5.min.js
];

// Instalación del service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación y limpieza del cache anterior si lo hubiera
self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['my-cache'];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Borrar cualquier caché no deseada
          }
        })
      );
    }).then(function() {
      return self.clients.claim(); // Activar el nuevo SW inmediatamente
    })
  );
});


// Fetch para servir los archivos desde el caché si están disponibles
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(function(registration) {
    console.log('Service Worker registrado con éxito:', registration.scope);
  }).catch(function(error) {
    console.log('Error al registrar el Service Worker:', error);
  });
}
