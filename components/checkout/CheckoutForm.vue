<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="formData.name"
            :rules="nameRules"
            label="Nombre"
            required
            variant="outlined"
            density="comfortable"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.email"
            :rules="emailRules"
            label="Email"
            required
            variant="outlined"
            density="comfortable"
            type="email"
          />
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="formData.phone"
            :rules="phoneRules"
            label="Teléfono"
            required
            variant="outlined"
            density="comfortable"
            type="tel"
          />
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="formData.notes"
            label="Información adicional"
            variant="outlined"
            rows="3"
            auto-grow
          />
        </v-col>
        <v-col cols="12">
          <v-radio-group
            v-model="formData.deliveryMethod"
            inline
            required
            :rules="deliveryMethodRules"
            :disabled="isLoadingShipping"
          >
            <template #label>
              <div class="text-subtitle-1 mb-2">Método de entrega</div>
            </template>
            <v-radio value="delivery" label="Envío a domicilio"/>
            <v-radio value="pickup" label="Retiro en persona"/>
          </v-radio-group>
        </v-col>

        <v-col v-if="formData.deliveryMethod === 'delivery'" cols="12">
          <v-divider class="my-4"/>
          <h3 class="text-subtitle-1 mb-4">Dirección de envío</h3>

          <v-alert
            v-if="formData.shippingAddress"
            type="success"
            variant="outlined"
            class="mb-4"
          >
            <div class="font-weight-medium mb-2">Dirección confirmada:</div>
            <div>{{ formatShippingAddress(formData.shippingAddress) }}</div>
            <v-btn
              size="small"
              variant="text"
              color="primary"
              class="mt-2"
              @click="handleEditShippingAddress"
            >
              Editar dirección
            </v-btn>
          </v-alert>

          <ShippingAddressForm
            v-if="!formData.shippingAddress || showShippingForm"
            ref="shippingAddressForm"
            :initial-data="formData.shippingAddress"
            @submit="handleShippingAddressSubmit"
            @cancel="handleShippingAddressCancel"
          />
        </v-col>

        <v-col v-if="formData.deliveryMethod === 'pickup'" cols="12">
          <v-divider class="my-4"/>
          <!-- Aquí irá el componente para seleccionar punto de retiro en el futuro-->
          <v-alert
            type="success"
            variant="outlined"
            class="mb-4"
          >
             <h3 class="text-subtitle-1 mb-4">Punto de retiro</h3>
             <p>Retiras en <span class="font-weight-black">Jacobo Watt 1769, CP 1757, Gregorio de Laferrere, Buenos Aires</span></p>
           </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Address } from '~/types/address';
import { DeliveryType } from '~/types/cart';
import ShippingAddressForm from './ShippingAddressForm.vue';
import { useCartStore } from '~/stores/cart';

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  deliveryMethod: string;
  shippingAddress?: Partial<Address>;
}

const props = defineProps<{
  isLoadingShipping: boolean;
}>();

const emit = defineEmits<{
  shippingAddressConfirmed: [address: Partial<Address>]
}>();

const valid = ref(false);
const shippingAddressForm = ref<InstanceType<typeof ShippingAddressForm> | null>(null);
const showShippingForm = ref(false);
const cartStore = useCartStore();

const formData = reactive<FormData>({
  name: '',
  email: '',
  phone: '',
  notes: '',
  deliveryMethod: '',
  shippingAddress: undefined,
});

// Actualizar el deliveryType del carrito cuando cambia el método de entrega
// y resetear la dirección si selecciona "Retiro en persona"
watch(
  () => formData.deliveryMethod,
  (newMethod) => {
    if (cartStore.cart && newMethod) {
      cartStore.cart.deliveryType = newMethod === 'delivery' ? DeliveryType.SHIPPING : DeliveryType.PICKUP;

      // Si selecciona "Retiro en persona", resetear la dirección
      if (newMethod === 'pickup') {
        formData.shippingAddress = undefined;
        showShippingForm.value = false;
      }
    }
  }
);

const nameRules = [
  (v: string) => !!v || 'El nombre es requerido',
  (v: string) => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres',
];

const emailRules = [
  (v: string) => !!v || 'El email es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'El email debe ser válido',
];

const phoneRules = [
  (v: string) => !!v || 'El teléfono es requerido',
  (v: string) => /^[0-9]{10,}$/.test(v) || 'Ingrese un número de teléfono válido',
];

const deliveryMethodRules = [
  (v: string) => !!v || 'Debe seleccionar un método de entrega',
];

const formatShippingAddress = (address: Partial<Address>): string => {
  const parts = [
    address.street,
    address.number,
    address.city,
    address.state,
    address.zipCode
  ].filter(Boolean);

  return parts.join(', ');
};

const handleShippingAddressSubmit = (shippingData: Partial<Address>) => {
  formData.shippingAddress = shippingData;
  showShippingForm.value = false;
  // Emitir evento cuando se confirma la dirección
  emit('shippingAddressConfirmed', shippingData);
};

const handleShippingAddressCancel = () => {
  formData.deliveryMethod = '';
  formData.shippingAddress = undefined;
  showShippingForm.value = false;
};

const handleEditShippingAddress = () => {
  showShippingForm.value = true;
};

defineExpose({
  formData,
  valid,
  shippingAddressForm,
});
</script> 