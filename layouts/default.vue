<template>
  <v-app>
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon/>
      <v-app-bar-title>Mi Tienda</v-app-bar-title>
      <v-spacer/>
      <app-cart-indicator />
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
  </v-app>
</template>

<script setup lang="ts">
import AppLoader from '~/components/app/AppLoader.vue';
import AppCartIndicator from '~/components/app/CartIndicator.vue';
</script>

<style scoped>
/* Estilos específicos del layout si son necesarios */
</style> 