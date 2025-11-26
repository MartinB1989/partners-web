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
import { useAlertStore } from '~/stores/alert';
import type { Address } from '~/types/address';

// Defino la interfaz para el componente CheckoutForm
interface CheckoutFormInstance {
  valid: boolean;
  formData: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    deliveryMethod: string;
    shippingAddress?: Partial<Address>;
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

  const alertStore = useAlertStore();
  const { name, email, phone, notes, deliveryMethod, shippingAddress } = checkoutFormRef.value.formData;

  // Validar que si el método es "delivery", la dirección es obligatoria
  if (deliveryMethod === 'delivery' && !shippingAddress) {
    alertStore.showAlert('La dirección de envío es obligatoria', 'error', 3000);
    return;
  }

  try {
    const order = currentCartToOrder(email, name, phone, notes);

    if (!order) {
      alertStore.showAlert('Error al procesar la orden', 'error', 3000);
      return;
    }

    // Si el método es "delivery", agregar la dirección a la orden
    if (deliveryMethod === 'delivery' && shippingAddress) {
      order.address = shippingAddress as Address;
    }

    const { data, error } = await createOrder(order);

    if (error) {
      alertStore.showAlert('Error al crear la orden', 'error', 3000);
      console.error('Error al crear la orden:', error);
    } else {
      alertStore.showAlert('Orden creada exitosamente', 'success', 3000);
      console.log('Orden generada:', data);
    }
  } catch (error) {
    alertStore.showAlert('Error al crear la orden', 'error', 3000);
    console.error('Error al crear la orden:', error);
  }
};
</script>