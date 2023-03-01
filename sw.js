const version = 2; // to force full upload, change version number here

const cacheName = 'cache-v1';
const resourcesToPrecache = [
  'index.html',
  // 'css/style-v2.css',
  // 'css/main-v2.css',
  // 'css/header-v2.css',
  // 'js/scripts-v2.js',
  // 'js/utilidades-v2.js',
  // 'js/saberMas-v2.js',
  // 'js/inputs-v2.js',
  // 'js/inputControl-v2.js',
  // 'js/fichaProducto-v2.js',
  // 'resources/ac_current.svg',
  // 'resources/acdc_current.svg',
  // 'resources/arrow_up.svg',
  // 'resources/bannerECODC.svg',
  // 'resources/dc_current.svg',
  // 'resources/toscano-logo-blanco.svg',
  // 'resources/icons/maskable_icon_x192.png',
  // 'resources/icons/maskable_icon_x384.png',
  // 'resources/icons/maskable_icon_x512.png',
  // 'resources/icons/maskable_icon.png',
  // 'resources/productos/eco-ac.webp',
  // 'resources/productos/eco-dc-inv-s.webp',
  // 'resources/productos/eco-dc-inv.webp',
  // 'resources/productos/eco-dc.webp',
  // 'resources/productos/salta-el-diferencial.webp'
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


self.addEventListener('fetch', (event) => {
  console.log('FETCH EVENT IN SW');
  event.respondWith(
    caches.open(cacheName)
      .then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        const fetchedResponse = fetch(event.request).then((networkResponse) => {
          
          cache.put(event.request, networkResponse.clone());
          
          const stringPattern = 'TEST=DELETE'; // COMENTAR ESTA LÍNEA
          // const stringPattern = 'toscano.es/?'; // DESCOMENTAR ESTA LÍNEA

          if (event.request.referrer.includes(stringPattern)) {
            console.log('>----------- DELETE PROTOCOL -----------<');
            // console.log(event.request);
            cache.delete(event.request);
          }

          return networkResponse;
        });

        return cachedResponse || fetchedResponse;
      }));
});
