<template>
  <v-container>
    <ClientOnly>
    <!-- Banner informativo cuando se compra de un vendedor específico -->
    <v-alert
      v-if="vendorId && vendorInfo"
      type="info"
      variant="tonal"
      class="mb-4"
      prominent
    >
      <template #prepend>
        <v-icon>mdi-store</v-icon>
      </template>
      <div class="text-h6 mb-1">Comprando productos de: {{ vendorInfo.name }}</div>
      <div class="text-body-2">
        Solo se procesarán los productos de este vendedor. Los demás productos permanecerán en tu carrito.
      </div>
    </v-alert>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <v-card-title class="text-h5 mb-4">Datos de compra</v-card-title>
          <CheckoutForm
            ref="checkoutFormRef"
            :is-loading-shipping="isLoadingShipping"
            @shipping-address-confirmed="handleShippingAddressConfirmed"
          />
          <v-divider class="my-4"/>
          <v-card-actions>
            <v-spacer/>
            <v-btn
              color="primary"
              size="large"
              :disabled="!formIsValid || isLoadingShipping"
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
          :shipping-cost="cartStore.cart?.deliveryPrice || 0"
          :is-loading-shipping="isLoadingShipping"
        />
        <v-card v-else class="pa-4">
          <v-card-text class="text-center">
            El carrito está vacío
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de procesamiento de pago -->
    <PaymentProcessingModal
      v-model="showProcessingModal"
      :step="processingStep"
    />
  </ClientOnly>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CheckoutForm from '~/components/checkout/CheckoutForm.vue';
import CheckoutSummary from '~/components/checkout/CheckoutSummary.vue';
import PaymentProcessingModal from '~/components/checkout/PaymentProcessingModal.vue';
import useOrder from '~/composables/services/useOrder';
import { useShipping } from '~/composables/services/useShipping';
import { useAlertStore } from '~/stores/alert';
import { useCartStore } from '~/stores/cart';
import { deliveryTypes } from '~/utils/index';
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
const router = useRouter();
const route = useRoute();
const { getCartSummary, currentCartToOrder, vendorCartToOrder, getVendorCartSummary } = useCartToOrder();
const { createOrder } = useOrder();
const { quoteShipping } = useShipping();
const cartStore = useCartStore();

// Detectar si estamos comprando de un vendedor específico
const vendorId = ref<string | null>(route.query.vendorId as string || null);
const vendorInfo = computed(() => {
  if (!vendorId.value) return null;
  return cartStore.getVendorInfo(vendorId.value);
});

// Obtener el resumen del carrito (completo o filtrado por vendedor)
const cartSummary = ref(
  vendorId.value
    ? getVendorCartSummary(vendorId.value)
    : getCartSummary()
);

const checkoutFormRef = ref<CheckoutFormInstance | null>(null);
const isLoadingShipping = ref(false);
const showProcessingModal = ref(false);
const processingStep = ref<'creating' | 'redirecting'>('creating');
const formIsValid = computed(() => {
  return checkoutFormRef.value?.valid || false;
});

// Resetear deliveryPrice a 0 cuando se carga la página
// y redirigir a /cart si el carrito está vacío
onMounted(() => {
  // Verificar si el carrito está vacío
  if (!cartStore.cart || !cartStore.cart.items || cartStore.cart.items.length === 0) {
    router.push('/cart');
    return;
  }

  // Si estamos comprando de un vendedor específico, verificar que tenga items
  if (vendorId.value) {
    const vendorItems = cartStore.getItemsByVendor(vendorId.value);
    if (vendorItems.length === 0) {
      router.push('/cart');
      return;
    }
  }

  cartStore.setDeliveryPrice(0);
});

// Watch para resetear deliveryPrice cuando cambia el método de entrega
watch(
  () => checkoutFormRef.value?.formData?.deliveryMethod,
  (newMethod) => {
    if (newMethod === deliveryTypes.PICKUP) {
      // Si selecciona "Retiro en persona", resetear el precio de envío a 0
      cartStore.setDeliveryPrice(0);
    }
  }
);

// Función para obtener el método de entrega con el tipo correcto
const getDeliveryMethod = (): '' | 'delivery' | 'pickup' => {
  const method = checkoutFormRef.value?.formData?.deliveryMethod || '';

  if (method === deliveryTypes.DELIVERY || method === deliveryTypes.PICKUP) {
    return method as '' | 'delivery' | 'pickup';
  }

  return '';
};

// Manejo del evento cuando se confirma la dirección de envío
const handleShippingAddressConfirmed = async (shippingAddress: Partial<Address>) => {
  const alertStore = useAlertStore();

  // Validar que tenemos los items del carrito
  if (!cartStore.cart || !cartStore.cart.items || cartStore.cart.items.length === 0) {
    alertStore.showAlert('El carrito está vacío', 'error', 3000);
    return;
  }

  try {
    // Iniciar el loader de envío
    isLoadingShipping.value = true;

    // Obtener los items a cotizar (todos o solo del vendedor)
    const itemsToQuote = vendorId.value
      ? cartStore.getItemsByVendor(vendorId.value)
      : cartStore.cart.items;

    // Calcular el total de los items a cotizar
    const totalToQuote = vendorId.value
      ? cartStore.getVendorSubtotal(vendorId.value)
      : (cartStore.cart.total || 0);

    // Cotizar el envío con los datos del carrito y la dirección
    const { data, error } = await quoteShipping(
      itemsToQuote,
      shippingAddress,
      totalToQuote
    );

    if (error) {
      alertStore.showAlert('Error al cotizar envío', 'error', 3000);
      console.error('Error en cotización:', error);
      isLoadingShipping.value = false;
      return;
    }

    // Setear el precio de envío en el carrito desde la respuesta de Zipnova
    if (data && data.deliveryPrice !== undefined) {
      cartStore.setDeliveryPrice(data.deliveryPrice);
      console.log('Precio de envío actualizado en el carrito:', data.deliveryPrice);
    } else {
      console.warn('No se pudo obtener el precio de envío de la respuesta');
    }

    console.log('Cotización completada exitosamente');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    alertStore.showAlert('Error al cotizar envío', 'error', 3000);
    console.error('Error:', errorMessage);
  } finally {
    // Detener el loader de envío
    isLoadingShipping.value = false;
  }
};

const confirmOrder = async () => {
  if (!formIsValid.value || !checkoutFormRef.value) {
    return;
  }

  const alertStore = useAlertStore();
  const { name, email, phone, notes, deliveryMethod, shippingAddress } = checkoutFormRef.value.formData;

  // Validar que si el método es "delivery", la dirección es obligatoria
  if (deliveryMethod === deliveryTypes.DELIVERY && !shippingAddress) {
    alertStore.showAlert('La dirección de envío es obligatoria', 'error', 3000);
    return;
  }

  try {
    // Mostrar el modal con el estado "creando orden"
    showProcessingModal.value = true;
    processingStep.value = 'creating';

    // Si es delivery, actualizar la dirección del carrito antes de crear la orden
    if (deliveryMethod === deliveryTypes.DELIVERY && shippingAddress && cartStore.cart) {
      cartStore.cart.address = shippingAddress as Address;
    }

    // Crear la orden según si es compra por vendedor o carrito completo
    const order = vendorId.value
      ? vendorCartToOrder(vendorId.value, email, name, phone, notes)
      : currentCartToOrder(email, name, phone, notes);

    if (!order) {
      showProcessingModal.value = false;
      alertStore.showAlert('Error al procesar la orden', 'error', 3000);
      return;
    }

    const { data, error } = await createOrder(order);

    if (error) {
      showProcessingModal.value = false;
      alertStore.showAlert('Error al crear la orden', 'error', 3000);
      console.error('Error al crear la orden:', error);
      return;
    }

    // Verificar si existe el initPoint en la respuesta
    if (data && data.payment && data.payment.initPoint) {
      // Cambiar el estado del modal a "redireccionando"
      processingStep.value = 'redirecting';

      // Esperar 3 segundos antes de redireccionar
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Redireccionar al initPoint de Mercado Pago
      window.location.href = data.payment.initPoint;
    } else {
      // Si no hay initPoint, cerrar el modal y mostrar mensaje de éxito
      showProcessingModal.value = false;
      alertStore.showAlert('Orden creada exitosamente', 'success', 3000);
      console.log('Orden generada:', data);
      await router.push('/checkout/success');
    }
  } catch (error) {
    showProcessingModal.value = false;
    alertStore.showAlert('Error al crear la orden', 'error', 3000);
    console.error('Error al crear la orden:', error);
  }
};
</script>