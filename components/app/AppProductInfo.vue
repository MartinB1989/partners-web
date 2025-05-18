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
      <v-btn
        color="primary"
        size="large"
        block
        :disabled="stock <= 0"
        prepend-icon="mdi-cart-plus"
        @click="$emit('add-to-cart')"
      >
        {{ buttonText }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title: string;
  price: number;
  stock: number;
  formattedPrice: string;
  buttonText?: string;
}

withDefaults(defineProps<Props>(), {
  buttonText: 'Agregar al carrito'
});

defineEmits<{
  (e: 'add-to-cart'): void;
}>();
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style> 