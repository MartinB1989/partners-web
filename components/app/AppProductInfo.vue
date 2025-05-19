<template>
  <div class="d-flex flex-column h-100">
    <h1 class="text-h4 font-weight-bold">{{ title }}</h1>
    
    <div class="my-4">
      <v-chip
        v-if="stock > 0"
        color="success"
        variant="outlined"
        class="mr-2"
      >
        En stock ({{ stock }} disponibles)
      </v-chip>
      <v-chip
        v-else
        color="error"
        variant="outlined"
      >
        Agotado
      </v-chip>
    </div>
    
    <div class="text-h4 font-weight-bold primary--text my-4">
      ${{ formattedPrice }}
    </div>
    
    <div class="mt-auto">
      <app-add-to-cart-button
        :product-id="productId"
        :stock="stock"
        :is-available="stock > 0"
        :button-text="buttonText"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppAddToCartButton from '~/components/app/AddToCartButton.vue'

interface Props {
  title: string;
  price: number;
  stock: number;
  formattedPrice: string;
  productId: number;
  buttonText?: string;
}

withDefaults(defineProps<Props>(), {
  buttonText: 'Agregar al carrito'
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 