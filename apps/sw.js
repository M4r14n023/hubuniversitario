const CACHE_NAME = 'agenda-v2'; // <--- Incrementá este número (v3, v4, etc.) cada vez que hagas cambios
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Agregá aquí tus archivos locales si tenés CSS/JS externos, por ejemplo:
  // './style.css', 
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'
];

// 1. INSTALACIÓN: Guarda los archivos en la nueva caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Instalando nueva caché:', CACHE_NAME);
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Fuerza al SW nuevo a activarse sin esperar
  );
});

// 2. ACTIVACIÓN: Borra cachés viejas para liberar espacio
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Borrando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de la app inmediatamente
  );
});

// 3. FETCH: Estrategia de Cache First con caída a Red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});