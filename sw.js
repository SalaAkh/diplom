/**
 * Service Worker для PWA
 * Обеспечивает офлайн работу и кэширование
 * 
 * Автор: Ахмедьянов Саламат КПО 9/22-2
 * Дата: 2026
 */

const CACHE_NAME = 'self-knowledge-v1';
const RUNTIME_CACHE = 'runtime-cache-v1';

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
  './js/storage.js',
  './js/localization.js',
  './js/auth.js',
  './js/scenarios-data.js',
  './js/advanced-scenarios-data.js',
  './js/analysis.js',
  './js/advanced-analysis.js',
  './js/dynamic-scenarios.js',
  './js/visualization.js',
  './js/visualization-3d.js',
  './js/navigation-controller.js',
  './js/background-3d.js',
  './js/gamification.js',
  './js/evolution-tracker.js',
  './js/report-generator.js',
  './js/3d-visualization.js',
  './js/ai-analysis.js',
  './js/ai-coach.js',
  './js/ml-engine.js',
  './js/quality-control.js',
  './js/feedback-system.js',
  './js/social-features.js',
  './js/advanced-analytics.js',
  './js/scenario-calibration.js',
  './js/statistical-validation.js',
  './js/test-reliability.js',
  './js/quality-dashboard.js',
  './js/app.js',
  './data/scenarios.json',
  './data/advanced-scenarios.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Установка...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Кэширование статических файлов');
        return cache.addAll(STATIC_CACHE_URLS.map(url => {
          try {
            return new Request(url, { mode: 'no-cors' });
          } catch (e) {
            return url;
          }
        })).catch(err => {
          console.warn('[Service Worker] Некоторые файлы не удалось закэшировать:', err);
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
  console.log('[Service Worker] Активация...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Удаляем старые кэши
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Удаление старого кэша:', cacheName);
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
            console.error('[Service Worker] Ошибка загрузки:', error);

            // Если это HTML запрос, возвращаем офлайн страницу
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html');
            }

            // Для других типов возвращаем пустой ответ
            return new Response('Офлайн режим', {
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
    self.registration.showNotification('Система самопознания', options)
  );
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
