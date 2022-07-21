
const cacheName = 'cache-v1';
const resourcesToPrecache = [
  '/',
  'index.html',
  'css/style.css',
  'css/main.css',
  'css/header.css',
  'js/scripts.js',
  'resources/ac_current.svg',
  'resources/acdc_current.svg',
  'resources/arrow_up.svg',
  'resources/bannerECODC.svg',
  'resources/dc_current.svg',
  'resources/toscano-logo-blanco.svg',
  'resources/icons/maskable_icon_x192.png',
  'resources/icons/maskable_icon_x384.png',
  'resources/icons/maskable_icon_x512.png',
  'resources/icons/maskable_icon.png',
  'resources/productos/eco-ac.webp',
  'resources/productos/eco-dc-inv-s.webp',
  'resources/productos/eco-dc-inv.webp',
  'resources/productos/eco-dc.webp',
  'resources/productos/salta-el-diferencial.webp',
  'hcdb.json'
];


self.addEventListener('install', function (event) {
  console.log('Service worker install event');
  event.waitUntil(
    caches.open(cacheName)
      .then(function (cache) {
        return cache.addAll(resourcesToPrecache);
      })
  );
});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//     .then(function(cachedResponse) {
//       return cachedResponse || fetch(event.request);
//       // return fetch(event.request) || cachedResponse;  // FIRST NETWORK, CACHE IF NOT
//     })
//   );
// });

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(cacheName)
    .then((cache) => {
    return cache.match(event.request).then((cachedResponse) => {
      const fetchedResponse = fetch(event.request).then((networkResponse) => {
        cache.put(event.request, networkResponse.clone());

        return networkResponse;
      });

      return cachedResponse || fetchedResponse;
    });
  }));
});
