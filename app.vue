<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
      <v-snackbar
        v-model="alertStore.show"
        :color="alertStore.type"
        :timeout="alertStore.timeout"
        :location="alertStore.location"
        transition="slide-y-transition"
        max-width="400"
      >
        <div class="d-flex align-center">
          <v-icon 
            class="mr-3" 
            :icon="getAlertIcon(alertStore.type)"
          />
          <span>{{ alertStore.message }}</span>
        </div>
        
        <template #actions>
          <v-btn
            variant="text"
            icon="mdi-close"
            @click="alertStore.hideAlert"
          />
        </template>
      </v-snackbar>
    </v-app>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'
const alertStore = useAlertStore()

// ✅ Configuración SEO global
const config = useRuntimeConfig()

useHead({
  titleTemplate: (title) => title ? `${title} - Partners` : 'Partners - Tu Marketplace de Confianza',
  htmlAttrs: {
    lang: 'es-AR'
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'canonical', href: config.public.siteUrl }
  ],
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})

useSeoMeta({
  ogSiteName: 'Partners',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})

const getAlertIcon = (type: 'success' | 'error' | 'warning' | 'info') => {
  switch (type) {
    case 'success': return 'mdi-check-circle';
    case 'error': return 'mdi-alert-circle';
    case 'warning': return 'mdi-alert';
    case 'info':
    default: return 'mdi-information';
  }
}
</script>