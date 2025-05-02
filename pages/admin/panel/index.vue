<template>
  <GridNavCards
    title="Panel de administración"
    :cards="cards"
  />
</template>

<script setup lang="ts">
import GridNavCards from '~/components/app/GridNavCards.vue'

definePageMeta({
  layout: 'admin'
})

const cards = [
  {
    to: '/admin/usuarios',
    icon: 'mdi-account-group',
    title: 'Usuarios'
  },
  {
    to: '/admin/products',
    icon: 'mdi-package-variant-closed',
    title: 'Productos'
  },
  {
    to: '/admin/ventas',
    icon: 'mdi-cart',
    title: 'Ventas'
  },
  {
    to: '/admin/configuracion',
    icon: 'mdi-cog',
    title: 'Configuración'
  },
  {
    to: '/admin/affiliate',
    icon: 'mdi-account-group',
    title: 'Vendedores'
  }
]
</script>

<style scoped>
.admin-panel {
  padding: 2rem;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: var(--text-primary);
}
</style>
