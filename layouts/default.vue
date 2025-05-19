<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon/>
      <v-app-bar-title>Mi Tienda</v-app-bar-title>
      <v-spacer/>
      <v-btn icon>
        <v-icon>mdi-cart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <!-- AppLoader para mostrar un loader global -->
    <AppLoader />

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
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
</template>

<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'
import AppLoader from '~/components/app/AppLoader.vue';

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

<style scoped>
/* Estilos específicos del layout si son necesarios */
</style> 