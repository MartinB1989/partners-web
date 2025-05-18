<template>
  <v-card class="product-card" elevation="2" :to="`/products/detail/${product.id}`" height="380">
    <v-img
      :src="mainImage"
      height="200"
      contain
      class="align-end"
      gradient="to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6)"
    >
      <v-card-title v-if="!hasImage" class="text-white">
        {{ truncateText(product.title, 35) }}
      </v-card-title>
    </v-img>
    
    <v-card-text class="d-flex flex-column justify-space-between" style="height: 180px;">
      <div>
        <div v-if="hasImage" class="text-subtitle-1 font-weight-medium mb-1 title-truncate">
          {{ truncateText(product.title, 35) }}
        </div>
        <div class="text-caption text-grey mt-2 description-truncate">
          {{ truncateText(product.description, 80) }}
        </div>
      </div>
      
      <div class="d-flex justify-space-between align-center mt-auto pt-2">
        <div class="text-h6 primary--text font-weight-bold">${{ formatPrice(product.price) }}</div>
        <v-chip
          v-if="product.stock > 0"
          size="small"
          color="success"
          variant="outlined"
        >
          En stock
        </v-chip>
        <v-chip
          v-else
          size="small"
          color="error"
          variant="outlined"
        >
          Agotado
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Product } from '~/types/product';

const props = defineProps<{
  product: Product;
}>();

const mainImage = computed(() => {
  if (!props.product.images || props.product.images.length === 0) {
    return 'https://partners-develop-216021.s3.us-east-1.amazonaws.com/imagen-de-no-hay-imagen.png';
  }
  
  const main = props.product.images.find(img => img.main);
  return main ? main.url : props.product.images[0].url;
});

const hasImage = computed(() => {
  return props.product.images && props.product.images.length > 0;
});

function formatPrice(price: number): string {
  return price.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
}
</script>

<style scoped>
.product-card {
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

.title-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.description-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style> 