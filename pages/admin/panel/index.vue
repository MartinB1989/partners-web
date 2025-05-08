<template>
  <GridNavCards
    title="Panel de administración"
    :cards="dashboardCards"
  />
</template>

<script setup lang="ts">
import GridNavCards from '~/components/app/GridNavCards.vue'
import { useItemMenu } from '~/composables/useItemMenu'

definePageMeta({
  layout: 'admin'
})

// Usar el composable de navegación para obtener las tarjetas del panel
const { dashboardCards } = useItemMenu()
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
