import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import branding from './app.config.json' with { type: 'json' }

const brandingHtmlPlugin = {
  name: 'quran-companion-branding',
  transformIndexHtml(html) {
    return html
      .replaceAll('%APP_NAME%', branding.name)
      .replaceAll('%APP_DESCRIPTION%', branding.description)
      .replaceAll('%THEME_COLOR%', branding.themeColor)
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    brandingHtmlPlugin,
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.{svg,png,ico}'],
      manifest: {
        name: branding.name, short_name: branding.shortName,
        description: branding.description,
        theme_color: branding.themeColor, background_color: branding.backgroundColor,
        display: 'standalone', start_url: '/',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { navigateFallback: '/index.html', globPatterns: ['**/*.{js,css,html,svg,woff2,json}'], runtimeCaching: [] },
    }),
  ],
})
