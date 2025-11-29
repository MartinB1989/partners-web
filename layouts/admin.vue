<template>
  <v-app>
    <ClientOnly>
    <!-- Barra de navegación superior -->
    <v-app-bar
      app
      elevation="1"
      color="primary"
    >
      <v-app-bar-nav-icon
        variant="text"
        color="white"
        @click.stop="drawer = !drawer"
      />
      
      <v-app-bar-title class="text-white">Panel de Administración</v-app-bar-title>
      
      <v-spacer/>
      
      <!-- Nombre de usuario en la barra superior -->
      <v-btn variant="text" color="white">
        <v-icon class="mr-2">mdi-account</v-icon>
        <span>{{ authStore.user?.name || 'Usuario' }}</span>
      </v-btn>
      
      <!-- Botón de cerrar sesión -->
      <v-btn 
        variant="text" 
        color="white" 
        prepend-icon="mdi-logout"
        @click="handleLogout"
      >
        Cerrar Sesión
      </v-btn>
    </v-app-bar>

    <!-- Navegación lateral (drawer) -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      :width="280"
      color="primary"
    >
      <!-- Logo en la parte superior del drawer -->
      <v-list-item class="pa-4">
        <v-list-item-title class="d-flex align-center">
          <v-avatar class="mr-3" color="primary" size="40">
            <v-icon dark>mdi-store</v-icon>
          </v-avatar>
          <span class="text-h6">Mi Tienda</span>
        </v-list-item-title>
      </v-list-item>

      <v-divider/>

      <!-- Menú de navegación -->
      <v-list nav density="compact">
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          link
          class="text-white"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido principal -->
    <v-main>
      <v-container fluid class="py-8 px-6">
        <slot />
      </v-container>
    </v-main>
  </ClientOnly>
  </v-app>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useItemMenu } from '~/composables/useItemMenu'
import { useRouter } from 'vue-router'

const alertStore = useAlertStore()
const authStore = useAuthStore()
const router = useRouter()
const drawer = ref(false);

// Usar el composable de navegación
const { menuItems } = useItemMenu()

// Función para cerrar sesión
const handleLogout = () => {
  authStore.logout()
  alertStore.showAlert(
    'Has cerrado sesión correctamente', 
    'success'
  )
  router.push('/admin')
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
