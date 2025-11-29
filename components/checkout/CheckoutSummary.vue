<template>
  <v-card class="pa-4">
    <ClientOnly>
    <v-card-title class="text-h5 mb-4">Resumen de compra</v-card-title>
    
    <v-list lines="two">
      <v-list-subheader class="font-weight-bold">Productos</v-list-subheader>
      
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :title="item.name"
        :subtitle="`Cantidad: ${item.quantity}`"
      >
        <template #append>
          <div class="text-right">
            <div class="text-body-1 font-weight-bold">
              <CurrencyDisplay :amount="item.price * item.quantity" bold />
            </div>
            <div class="text-caption text-grey">
              <CurrencyDisplay :amount="item.price" /> c/u
            </div>
          </div>
        </template>
      </v-list-item>
      
      <v-divider class="my-3"/>
      
      <v-list-item title="Subtotal">
        <template #append>
          <div class="text-body-1">
            <CurrencyDisplay :amount="subtotal" />
          </div>
        </template>
      </v-list-item>
      
      <v-list-item v-if="deliveryMethod === 'delivery'" title="Envío">
        <template #append>
          <div v-if="isLoadingShipping" class="d-flex align-center gap-2">
            <v-progress-circular
              size="20"
              width="2"
              indeterminate
              color="primary"
            />
            <span class="text-caption">Cotizando...</span>
          </div>
          <div v-else class="text-body-1">
            <CurrencyDisplay :amount="shippingCost" />
          </div>
        </template>
      </v-list-item>
      
      <v-divider class="my-3"/>
      
      <v-list-item title="Total" class="font-weight-bold">
        <template #append>
          <div class="text-h6 font-weight-bold">
            <CurrencyDisplay :amount="total" bold />
          </div>
        </template>
      </v-list-item>
    </v-list>
    
    <v-alert
      v-if="deliveryMethod === 'pickup'"
      type="info"
      variant="tonal"
      class="mt-4"
      density="comfortable"
    >
      Retiro en persona sin costo adicional
    </v-alert>
  </ClientOnly>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CurrencyDisplay from '~/components/app/CurrencyDisplay.vue';

interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Props {
  items: CartItem[];
  deliveryMethod: 'delivery' | 'pickup' | '';
  shippingCost?: number;
  isLoadingShipping?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  shippingCost: 0,
  isLoadingShipping: false,
});

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const total = computed(() => {
  if (props.deliveryMethod === 'delivery') {
    return subtotal.value + props.shippingCost;
  }
  return subtotal.value;
});
</script> 