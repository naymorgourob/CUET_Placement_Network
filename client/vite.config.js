import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5174,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // Only precache built static assets (JS/CSS/fonts/icons). API calls,
      // uploads, and auth data are never touched by the service worker.
      // Navigations (page loads/route changes) always go to the network so
      // the SPA shell and client-side routing behave exactly as without a
      // service worker; offline.html is served only when that network
      // request actually fails.
      workbox: {
        globPatterns: ['**/*.{js,css,svg,png,ico,woff,woff2,html}'],
        globIgnores: ['index.html'],
        navigateFallback: undefined,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkOnly',
            options: {
              precacheFallback: { fallbackURL: '/offline.html' },
            },
          },
        ],
      },
      includeAssets: ['favicon.svg', 'icons.svg', 'pwa-icons/*.png'],
      manifest: {
        name: 'CUET Placement Network',
        short_name: 'CUET Placement',
        description: 'Campus placement and recruitment platform for CUET students, recruiters, and administrators.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#faf9f6',
        theme_color: '#3730a6',
        icons: [
          {
            src: '/pwa-icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-icons/maskable-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
