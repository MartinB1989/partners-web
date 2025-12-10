<template>
  <v-container class="grid-nav-cards">
    <h1>{{ title }}</h1>
    <div class="nav-grid">
      <NavCard
        v-for="card in cards"
        :key="card.to"
        :to="card.to"
        :icon="card.icon"
        :title="card.title"
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import NavCard from '~/components/app/NavCard.vue'

defineProps<{
  title: string
  cards: {
    to: string
    icon: string
    title: string
  }[]
}>()
</script>

<style scoped>
.grid-nav-cards {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2rem;
  margin-top: 2rem;
  justify-items: center;
  width: 100%;
}

@media (max-width: 1280px) {
  .nav-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 960px) {
  .nav-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .nav-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 400px) {
  .nav-grid {
    grid-template-columns: 1fr;
  }
}

h1 {
  margin-bottom: 2rem;
  color: var(--text-primary);
}
</style>
