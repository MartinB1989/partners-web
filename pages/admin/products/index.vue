<template>
  <GridNavCards
    title="Productos"
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
    to: '/admin/panel',
    icon: 'mdi-home',
    title: 'Panel'
  },
  {
    to: '/admin/products/my-products',
    icon: 'mdi-package-variant-closed',
    title: 'Mis productos'
  },
  {
    to: '/admin/products/new-product',
    icon: 'mdi-plus',
    title: 'Nuevo producto'
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
