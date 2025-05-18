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

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script setup>
// Aquí puedes añadir la lógica del componente si es necesaria
</script>

<style scoped>
/* Estilos específicos del layout si son necesarios */
</style> 