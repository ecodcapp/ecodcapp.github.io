const version = '6'; // to force full upload, change version number here

const cacheName = 'cache-v1';
const resourcesToPrecache = [
  'index.html',
  'css/style-v4.css',
  'css/main-v4.css',
  'css/header-v4.css',
  'js/scripts-v4.js',
  'js/utilidades-v4.js',
  'js/saberMas-v4.js',
  'js/inputs-v4.js',
  'js/inputControl-v4.js',
  'js/fichaProducto-v5.js',
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
  'resources/esquemas/ESQUEMA-ECO-AC.png',
];

self.addEventListener('install', event => {
  console.log('Service worker install event');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(resourcesToPrecache))
      .catch(error => console.error('Failed to cache resources:', error))
  );
});

const ignoreCachingPatterns = [
  "google-analytics.com",
  "googletagmanager.com",
  "toscano.es/?",
  "5501/?"
];

function shouldIgnoreRequest(url) {
  return ignoreCachingPatterns.some(pattern => url.includes(pattern));
}

self.addEventListener('fetch', event => {
  if (shouldIgnoreRequest(event.request.url)) {
    // console.log('IGNORE CACHING');
  } else {
    event.respondWith(
      caches.open(cacheName)
        .then(async cache => {
          const cachedResponse = await cache.match(event.request);
          const fetchedResponse = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(error => {
            console.error('Fetch failed:', error);
            throw error;
          });

          return cachedResponse || fetchedResponse;
        }).catch(error => {
          console.error('Cache open failed:', error);
          throw error;
        })
    );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (!cacheWhitelist.includes(cache)) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});