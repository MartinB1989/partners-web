<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <v-card-title class="text-h5 mb-4">Datos de compra</v-card-title>
          <CheckoutForm ref="checkoutFormRef" />
          <v-divider class="my-4"/>
          <v-card-actions>
            <v-spacer/>
            <v-btn
              color="primary"
              size="large"
              :disabled="!formIsValid"
              @click="confirmOrder"
            >
              Procesar compra
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <CheckoutSummary 
          v-if="cartSummary"
          :items="cartSummary.items" 
          :delivery-method="getDeliveryMethod()" 
        />
        <v-card v-else class="pa-4">
          <v-card-text class="text-center">
            El carrito está vacío
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CheckoutForm from '~/components/checkout/CheckoutForm.vue';
import CheckoutSummary from '~/components/checkout/CheckoutSummary.vue';
import useOrder from '~/composables/services/useOrder';
import type { Order } from '~/types/order';

// Defino la interfaz para el componente CheckoutForm
interface CheckoutFormInstance {
  valid: boolean;
  formData: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    deliveryMethod: string;
  };
}

// Usamos el composable para obtener los datos del carrito
const { getCartSummary, currentCartToOrder } = useCartToOrder();
const { createOrder } = useOrder();
const cartSummary = ref(getCartSummary());

const checkoutFormRef = ref<CheckoutFormInstance | null>(null);
const formIsValid = computed(() => {
  return checkoutFormRef.value?.valid || false;
});

// Función para obtener el método de entrega con el tipo correcto
const getDeliveryMethod = (): '' | 'delivery' | 'pickup' => {
  const method = checkoutFormRef.value?.formData?.deliveryMethod || '';
  
  if (method === 'delivery' || method === 'pickup') {
    return method;
  }
  
  return '';
};

const confirmOrder = async () => {
  if (!formIsValid.value || !checkoutFormRef.value) {
    return;
  }
  try {
    const { name, email, phone, notes } = checkoutFormRef.value.formData;
    const order = currentCartToOrder(email, name, phone, notes);
    
    const { data, error } = await createOrder(order as Order);
  
    if (error) {
      console.error('Error al crear la orden:', error);
    } else {
      console.log('Orden generada:', data);
    }
  } catch (error) {
    console.error('Error al crear la orden:', error);
  }
};
</script>