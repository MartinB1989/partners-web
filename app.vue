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