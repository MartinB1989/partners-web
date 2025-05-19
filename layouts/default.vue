<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" app elevation="0" class="px-4">
      <v-app-bar-title>Mi Tienda</v-app-bar-title>
      <v-spacer/>
      <app-cart-indicator />
    </v-app-bar>

    
    <v-main>
      <app-navigation-menu class="app-navigation" />
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <!-- AppLoader para mostrar un loader global -->
    <AppLoader />

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import AppLoader from '~/components/app/AppLoader.vue';
import AppCartIndicator from '~/components/app/CartIndicator.vue';
import AppNavigationMenu from '~/components/app/AppNavigationMenu.vue';
</script>

<style scoped>
.app-navigation {
  margin-top: 64px; /* Altura predeterminada del app-bar */
}

@media (max-width: 600px) {
  .app-navigation {
    margin-top: 56px; /* Altura del app-bar en pantallas pequeñas */
  }
}
</style> 