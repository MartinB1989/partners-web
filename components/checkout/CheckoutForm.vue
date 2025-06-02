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
          >
            <template #label>
              <div class="text-subtitle-1 mb-2">Método de entrega</div>
            </template>
            <v-radio value="delivery" label="Envío a domicilio"/>
            <v-radio value="pickup" label="Retiro en punto"/>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
  deliveryMethod: string;
}

const valid = ref(false);

const formData = reactive<FormData>({
  name: '',
  email: '',
  phone: '',
  notes: '',
  deliveryMethod: '',
});

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

defineExpose({
  formData,
  valid,
});
</script> 