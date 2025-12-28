<template>
  <v-card flat>
    <v-window v-model="currentImage">
      <v-window-item
        v-for="(image, i) in images"
        :key="i"
      >
        <div class="gallery-image-wrapper">
          <NuxtImg
            :src="image.url"
            width="600"
            height="400"
            format="webp"
            :loading="i === 0 ? 'eager' : 'lazy'"
            :alt="`${productTitle || 'Producto'} - Imagen ${i + 1}`"
            fit="contain"
            class="rounded-lg gallery-main-image"
          />
        </div>
      </v-window-item>
    </v-window>

    <div class="mt-4 thumbnails-container">
      <v-card
        v-for="(image, i) in images"
        :key="i"
        :elevation="currentImage === i ? 4 : 0"
        :class="['thumbnail-card', currentImage === i ? 'border border-primary' : '']"
        @click="currentImage = i"
      >
        <NuxtImg
          :src="image.url"
          width="70"
          height="70"
          format="webp"
          loading="lazy"
          :alt="`${productTitle || 'Producto'} - Miniatura ${i + 1}`"
          fit="cover"
          class="rounded"
        />
      </v-card>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { ProductImage } from '~/types/product';

interface Props {
  images: ProductImage[];
  productTitle?: string;
}

defineProps<Props>();
const currentImage = ref(0);
</script>

<style scoped>
.gallery-image-wrapper {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-main-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.thumbnails-container {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 8px 4px;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: thin; /* Firefox */
}

.thumbnails-container::-webkit-scrollbar {
  height: 6px;
}

.thumbnails-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.thumbnails-container::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 10px;
}

.thumbnails-container::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

.thumbnail-card {
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 0 0 auto;
  min-width: 70px;
  margin: 0 2px;
}

.thumbnail-card:hover {
  transform: scale(1.05);
}
</style> 