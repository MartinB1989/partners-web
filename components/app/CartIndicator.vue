<template>
  <div class="cart-indicator">
    <v-badge
      :content="cartStore.totalItems.toString()"
      :value="cartStore.totalItems"
      color="red"
      overlap
    >
      <v-btn
        icon
        variant="text"
        :to="{ name: 'cart' }"
        :disabled="cartStore.loading"
      >
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-badge>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
</script>

<style scoped>
.cart-indicator {
  margin-right: 8px;
}
</style>