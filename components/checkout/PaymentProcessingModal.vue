<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
    max-width="500"
  >
    <v-card class="pa-6">
      <v-card-text class="text-center">
        <v-progress-circular
          :size="70"
          :width="7"
          color="primary"
          indeterminate
          class="mb-6"
        />

        <h2 class="text-h5 mb-2">
          {{ currentTitle }}
        </h2>

        <p class="text-body-1 text-medium-emphasis">
          Por favor, no cierres esta ventana
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean;
  step: 'creating' | 'redirecting';
}

const props = defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const currentTitle = computed(() => {
  switch (props.step) {
    case 'creating':
      return 'Estamos creando tu orden';
    case 'redirecting':
      return 'Estamos redireccionando a Mercado Pago';
    default:
      return 'Procesando...';
  }
});
</script>
