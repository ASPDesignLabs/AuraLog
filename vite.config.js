import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt", // ✅ manual refresh only
      includeAssets: [
        "favicon.ico",
        "icon-192.png",
        "icon-512.png",
        "offline.html",
      ],
      manifest: {
        name: "Auralog",
        short_name: "Auralog",
        start_url: ".",
        display: "standalone",
        background_color: "#0a0a0a",
        theme_color: "#2563eb",
        orientation: "portrait",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // ✅ precache all assets
        runtimeCaching: [
          {
            // ✅ Cache JS, CSS, and workers for offline use
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "worker",
            handler: "CacheFirst",
            options: {
              cacheName: "app-shell",
              expiration: { maxEntries: 50 },
            },
          },
          {
            // ✅ Cache images (update when online, fallback offline)
            urlPattern: ({ request }) => request.destination === "image",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
              },
            },
          },
        ],
        navigateFallback: "/offline.html", // ✅ fallback page if route not cached
      },
      srcDir: "public",
      filename: "sw.js", // ✅ ensure custom sw.js is used
    }),
  ],
});
