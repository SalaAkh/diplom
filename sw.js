/**
 * PWA үшін Service Worker (Service Worker for PWA)
 * Офлайн жұмыс пен кэштеуді қамтамасыз етеді (Provides offline work and caching)
 * 
 * Авторы (Author): Ахмедьянов Саламат КПО 9/22-2
 * Мерзімі (Date): 2026
 */

const CACHE_NAME = 'self-knowledge-v1.1';
const RUNTIME_CACHE = 'runtime-cache-v1.1';

// Файлы для кэширования при установке
const STATIC_CACHE_URLS = [
  './',
  './index.html',
  './about.html',
  './profile.html',
  './css/design-tokens.css',
  './css/typography.css',
  './css/navigation.css',
  './css/layout.css',
  './css/styles.css',
  './css/pages.css',
  './css/gamification.css',
  './css/themes.css',
  './js/services/storage.js',
  './js/services/localization.js',
  './js/services/auth.js',
  './js/data/scenarios-data.js',
  './js/data/advanced-scenarios-data.js',
  './js/analysis/analysis.js',
  './js/analysis/advanced-analysis.js',
  './js/data/dynamic-scenarios.js',
  './js/vis/visualization.js',
  './js/vis/visualization-3d.js',
  './js/ui/navigation-controller.js',
  './js/vis/background-3d.js',
  './js/services/gamification.js',
  './js/analysis/evolution-tracker.js',
  './js/analysis/report-generator.js',
  './js/vis/3d-visualization.js',
  './js/analysis/ai-analysis.js',
  './js/analysis/ai-coach.js',
  './js/analysis/ml-engine.js',
  './js/analysis/quality-control.js',
  './js/services/feedback-system.js',
  './js/services/social-features.js',
  './js/analysis/advanced-analytics.js',
  './js/analysis/scenario-calibration.js',
  './js/analysis/statistical-validation.js',
  './js/analysis/test-reliability.js',
  './js/analysis/quality-dashboard.js',
  './js/app.js',
  './data/scenarios.json',
  './data/advanced-scenarios.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Орнатылуда... (Installing...)');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Статикалық файлдарды кэштеу (Caching static files)');
        return cache.addAll(STATIC_CACHE_URLS.map(url => {
          try {
            return new Request(url, { mode: 'no-cors' });
          } catch (e) {
            return url;
          }
        })).catch(err => {
          console.warn('[Service Worker] Кейбір файлдар кэштелмеді (Some files could not be cached):', err);
          // Продолжаем даже если некоторые файлы не закэшировались
          return Promise.resolve();
        });
      })
  );

  // Активируем новый Service Worker сразу
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Белсендірілуде... (Activating...)');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Удаляем старые кэши
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Ескі кэшті жою (Deleting old cache):', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );

  // Берем контроль над всеми страницами
  return self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем не-GET запросы
  if (event.request.method !== 'GET') {
    return;
  }

  // Пропускаем запросы к внешним API (если они есть)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && !url.href.includes('cdn.jsdelivr.net')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Возвращаем из кэша, если есть
        if (cachedResponse) {
          return cachedResponse;
        }

        // Иначе загружаем из сети
        return fetch(event.request)
          .then((response) => {
            // Проверяем валидность ответа
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Клонируем ответ для кэширования
            const responseToCache = response.clone();

            // Кэшируем в runtime cache
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Жүктеу қатесі (Loading error):', error);

            // Если это HTML запрос, возвращаем офлайн страницу
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }

            // Для других типов возвращаем пустой ответ
            return new Response('Офлайн режим (Offline mode)', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    // Кэширование дополнительных URL по запросу
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
});

// Фоновая синхронизация (если поддерживается)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Здесь можно добавить логику синхронизации данных
      Promise.resolve()
    );
  }
});

// Push-уведомления
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('Өзіндік тану жүйесі (Self-Knowledge System)', options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
