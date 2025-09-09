/* global self, clients */

// Install event → activate immediately
self.addEventListener("install", (event) => {
  console.log("📦 [Service Worker] Installed");
  self.skipWaiting(); // ✅ activate immediately
});

// Activate event → claim clients
self.addEventListener("activate", (event) => {
  console.log("📦 [Service Worker] Activated");
  event.waitUntil(self.clients.claim()); // ✅ take control of all clients
});

// Listen for messages from the app
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "CACHE_APP") {
    console.log("📦 [Service Worker] User requested app caching...");

    // Force activate this SW immediately
    self.skipWaiting();
    self.clients.claim();

    // Notify the app that caching is complete
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) =>
        client.postMessage({ type: "APP_CACHED" })
      );
    });
  }
});
