// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import type { NuxtPage } from 'nuxt/schema'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
      googleMapsApiKey: process.env.NUXT_GOOGLE_MAPS_API_KEY || '',
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