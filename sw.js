/**
 * PWA үшін Service Worker (Service Worker for PWA)
 * Офлайн жұмыс пен кэштеуді қамтамасыз етеді (Provides offline work and caching)
 * 
 * Авторы (Author): Ахмедьянов Саламат КПО 9/22-2
 * Мерзімі (Date): 2026
 */

const CACHE_NAME = 'self-knowledge-v1.5';
const RUNTIME_CACHE = 'runtime-cache-v1.5';

// Файлы для кэширования при установке
const STATIC_CACHE_URLS = [
  './',
  './index.html',
  './about.html',
  './profile.html',
  './manifest.json',

  // CSS
  './css/design-tokens.css',
  './css/typography.css',
  './css/navigation.css',
  './css/layout.css',
  './css/styles.css',
  './css/pages.css',
  './css/themes.css',
  './css/accessibility.css',
  './css/google-auth.css',
  './css/landing.css',
  './css/modal.css',
  './css/transitions.css',

  // i18n
  './i18n/en.json',
  './i18n/ru.json',
  './i18n/kk.json',

  // JS — Core
  './js/app.js',
  './js/config/config.js',
  './js/core/AppState.js',
  './js/core/EventBus.js',

  // JS — Data
  './js/data/scenarios-data.js',
  './js/data/advanced-scenarios-data.js',
  './js/data/dynamic-scenarios.js',
  './js/data/advanced-test-organizer.js',
  './js/data/celebrity-profiles.js',
  './js/data/cognitive-test-data.js',

  // JS — Analysis
  './js/analysis/analysis.js',
  './js/analysis/advanced-analysis.js',
  './js/analysis/comparative-analysis.js',
  './js/analysis/evolution-tracker.js',
  './js/analysis/ai-analysis.js',
  './js/analysis/ai-coach.js',
  './js/analysis/ml-engine.js',
  './js/analysis/quality-control.js',
  './js/analysis/advanced-analytics.js',
  './js/analysis/scenario-calibration.js',
  './js/analysis/statistical-validation.js',
  './js/analysis/test-reliability.js',
  './js/analysis/quality-dashboard.js',

  // JS — Services
  './js/services/storage.js',
  './js/services/localization.js',
  './js/services/localization-patch.js',
  './js/services/auth.js',
  './js/services/accessibility-service.js',
  './js/services/audio-feedback.js',
  './js/services/celebrity-service.js',
  './js/services/data-loader.js',
  './js/services/error-handler.js',
  './js/services/feedback.js',
  './js/services/feedback-system.js',
  './js/services/keyboard-navigation.js',
  './js/services/logger.js',
  './js/services/report-generator.js',
  './js/services/resource-loader.js',
  './js/services/social-features.js',
  './js/services/voice-control.js',

  // JS — Managers
  './js/managers/results-manager.js',
  './js/managers/test-manager.js',

  // JS — UI
  './js/ui/ui-controller.js',
  './js/ui/navigation-controller.js',
  './js/ui/profile-extensions.js',
  './js/ui/toast-manager.js',
  './js/ui/views/BaseView.js',
  './js/ui/views/IntroView.js',
  './js/ui/views/ResultsView.js',
  './js/ui/views/ScenarioView.js',
  './js/ui/views/TestSelectionView.js',

  // JS — Vis
  './js/vis/visualization.js',
  './js/vis/particles-background.js',

  // Data
  './data/scenarios.json',
  './data/advanced-scenarios.json',

  // Icons
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
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
