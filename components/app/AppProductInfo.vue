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
      <app-currency-display :amount="price" color="primary" bold class="text-h4" />
    </div>

    <div class="mt-auto">
      <!-- Alerta cuando el vendedor no tiene métodos de entrega configurados -->
      <v-alert
        v-if="!hasDeliveryMethods"
        type="warning"
        variant="tonal"
        class="mb-4"
      >
        Este vendedor no tiene configurado métodos de entrega. No puedes agregar este producto.
      </v-alert>

      <!-- Botón de agregar al carrito solo si hay métodos de entrega -->
      <app-add-to-cart-button
        v-if="hasDeliveryMethods"
        :product-id="productId"
        :stock="stock"
        :is-available="stock > 0"
        :button-text="buttonText"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { SellerSettings } from '~/types/user'
import AppAddToCartButton from '~/components/app/AddToCartButton.vue'
import AppCurrencyDisplay from '~/components/app/CurrencyDisplay.vue'

interface Props {
  title: string;
  price: number;
  stock: number;
  productId: number;
  buttonText?: string;
  sellerSettings?: SellerSettings | null;
}

const props = withDefaults(defineProps<Props>(), {
  buttonText: 'Agregar al carrito',
  sellerSettings: null
});

// Computed para verificar si el vendedor tiene métodos de entrega configurados
const hasDeliveryMethods = computed(() => {
  // Si no hay sellerSettings, no tiene métodos de entrega
  if (!props.sellerSettings) {
    return false
  }

  // Si no acepta entregas a domicilio ni retiro en punto, no tiene métodos de entrega
  if (!props.sellerSettings.acceptsHomeDelivery && !props.sellerSettings.acceptsPickup) {
    return false
  }

  return true
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 