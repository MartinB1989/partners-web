// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import type { NuxtPage } from 'nuxt/schema'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  // ✅ Habilitar SSR selectivo
  ssr: true,

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
      googleMapsApiKey: process.env.NUXT_GOOGLE_MAPS_API_KEY || '',
      zipnovaApiToken: process.env.NUXT_PUBLIC_ZIPNOVA_API_TOKEN,
      zipnovaApiSecret: process.env.NUXT_PUBLIC_ZIPNOVA_API_SECRET,
      zipnovaAccountId: process.env.NUXT_ZIPNOVA_ACCOUNT_ID,
      zipnovaOriginId: process.env.NUXT_ZIPNOVA_ORIGIN_ID,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    }
  },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error Vuetify is not typed
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  // ✅ Configurar SSR/CSR selectivo por ruta
  routeRules: {
    // Páginas públicas: SSR con caché
    '/': { ssr: true },
    '/products': { ssr: true, swr: 3600 },      // Cache 1 hora
    '/products/**': { ssr: true, swr: 1800 },   // Cache 30 min

    // Admin: CSR (client-side rendering) - sin cambios
    '/admin': { ssr: false },
    '/admin/**': { ssr: false },

    // Cart y Checkout: CSR (estado de sesión)
    '/cart': { ssr: false },
    '/checkout/**': { ssr: false }
  },

  // ✅ Configurar prerender para home y sitemap
  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: false
    }
  },

  hooks: {
    'pages:extend' (pages) {
      function setMiddleware (pages: NuxtPage[]) {
        for (const page of pages) {
          // Aplicar middleware a rutas admin/*
          if (page.path?.startsWith('/admin/')) {
            page.meta ||= {}
            page.meta.middleware = ['auth']
            
            // Para rutas específicas como categories aplicar middleware admin-only
            if (page.path?.includes('/admin/categories')) {
              page.meta.middleware = [...(Array.isArray(page.meta.middleware) 
                ? page.meta.middleware 
                : [page.meta.middleware].filter(Boolean)), 'admin-only']
            }
          }
          
          // Procesar páginas hijas
          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }
      setMiddleware(pages)
    }
  }
})