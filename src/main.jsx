import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

let isCached = false;
let persistentGranted = false;
let deferredPrompt = null;

// Register service worker
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("New version available. Use Refresh App to update.");
  },
  onOfflineReady() {
    console.log("App ready to work offline");
    isCached = true;
    window.dispatchEvent(new Event("appcached"));
  },
});

// ✅ Expose manual refresh
window.refreshApp = () => {
  if (updateSW) {
    updateSW(true);
    window.location.reload();
  }
};

// ✅ Expose manual cache trigger
window.cacheApp = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg.active) {
        console.log("📦 Triggering service worker to precache assets...");
        reg.active.postMessage({ type: "CACHE_APP" });
        alert("📦 App is being cached for offline use.");
      } else {
        alert("⚠️ Service worker not active yet. Try again after reload.");
      }
    } catch (err) {
      console.error("SW error:", err);
      alert("⚠️ Service worker not available.");
    }
  } else {
    alert("⚠️ Service workers not supported in this browser.");
  }
};

// ✅ Request persistent storage
async function requestPersistence() {
  if (navigator.storage && navigator.storage.persist) {
    const granted = await navigator.storage.persist();
    persistentGranted = granted;
    console.log(
      granted
        ? "✅ Persistent storage granted"
        : "⚠️ Persistent storage not granted"
    );
    window.dispatchEvent(new Event("storagecheck"));
  } else {
    console.log("⚠️ Persistent storage API not supported");
  }
}
requestPersistence();

// ✅ Expose status getters
window.isAppCached = () => isCached;
window.isPersistentStorage = () => persistentGranted;

// ✅ Listen for SW messages
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "APP_CACHED") {
      console.log("✅ App caching complete.");
      isCached = true;
      window.dispatchEvent(new Event("appcached"));
    }
  });
}

// ✅ Capture install prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // stop auto prompt
  deferredPrompt = e;
  console.log("📲 Install prompt captured. Use window.promptInstallApp()");
  window.dispatchEvent(new Event("installpromptavailable"));
});

// ✅ Expose install trigger
window.promptInstallApp = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User install choice:", outcome);
    deferredPrompt = null;
  } else {
    alert("⚠️ Install prompt not available yet.");
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
