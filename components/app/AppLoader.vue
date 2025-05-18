<template>
  <v-overlay
    v-model="loading"
    class="align-center justify-center"
    persistent
    :opacity="0.7"
  >
    <v-card
      color="background"
      class="pa-6 rounded-lg text-center elevation-8"
      width="300"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
        width="5"
      />
      <div class="mt-4 text-body-1">{{ message }}</div>
    </v-card>
  </v-overlay>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useLoaderStore } from '@/stores/loader';

const loaderStore = useLoaderStore();

const loading = computed(() => loaderStore.loading);
const message = computed(() => loaderStore.message);
</script> 