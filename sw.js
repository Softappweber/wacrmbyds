const CACHE_NAME = 'whatsapp-crm-v1';
const ASSETS = [
  '/wacrmbyds/',
  '/wacrmbyds/index.html',
  '/wacrmbyds/dashboard.html',
  '/wacrmbyds/leads.html',
  '/wacrmbyds/templates.html',
  '/wacrmbyds/whatsapp.html',
  '/wacrmbyds/bulksend.html',
  '/wacrmbyds/followups.html',
  '/wacrmbyds/activitylog.html',
  '/wacrmbyds/analytics.html',
  '/wacrmbyds/tags.html',
  '/wacrmbyds/apiconnector.html',
  '/wacrmbyds/automation.html',
  '/wacrmbyds/campaigns.html',
  '/wacrmbyds/team.html',
  '/wacrmbyds/reports.html',
  '/wacrmbyds/pipeline.html',
  '/wacrmbyds/chat-history.html',
  '/wacrmbyds/importexport.html',
  '/wacrmbyds/settings.html',
  '/wacrmbyds/quick-replies.html',
  '/wacrmbyds/media-sending.html',
  '/wacrmbyds/lead-scoring.html',
  '/wacrmbyds/reminders.html',
  '/wacrmbyds/email-integration.html',
  '/wacrmbyds/automation-help.html',
  '/wacrmbyds/campaign-help.html',
  '/wacrmbyds/pipeline-help.html'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy: Cache First, Network Fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        if (cached) return cached;
        
        return fetch(event.request).then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
  );
});
