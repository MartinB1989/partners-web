<template>
  <NuxtLink :to="to" class="nav-card">
    <div class="nav-card-content">
      <v-icon :icon="icon" size="32" color="primary" />
      <h3 class="text-center text-primary">{{ title }}</h3>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  icon: string
  title: string
}>()
</script>

<style scoped>
.nav-card {
  display: block;
  text-decoration: none;
  border: 3px solid rgb(var(--v-theme-primary));
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  max-width: 180px;
  max-height: 180px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.nav-card-content h3 {
  color: var(--primary);
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
